import { zodResolver } from '@hookform/resolvers/zod';
import type { Params } from '@remix-run/react';
import type { APIGuild, APIRole } from 'discord-api-types/v10';
import type { Model } from 'mongoose';
import { getValidatedFormData } from 'remix-hook-form';
import type * as z from 'zod';
import type { ZodEffects, ZodObject, ZodTypeAny } from 'zod';
import { Discord } from '~/libs/constants';
import { Snowflake } from '~/libs/database/zod/discord';
import { hasPermission } from '~/libs/utils';
import { type DiscordUser, auth } from './auth';
import { getGuild, getGuildMember, getRoles } from './discord';

/** 値がSnowflakeの基準を満たしているか確認 */
export function isSnowflake(id: unknown): id is string {
  const { success } = Snowflake.safeParse(id);
  return success;
}

type HasAccessPermissonRes =
  | { ok: false; data?: undefined }
  | {
      ok: true;
      data: { user: DiscordUser; roles: APIRole[]; guild: APIGuild };
    };

/** ダッシュボードのアクセス権限を持っているか確認 */
export async function hasAccessPermission(
  request: Request,
  params: Params<string>,
): Promise<HasAccessPermissonRes> {
  if (!isSnowflake(params.guildId)) return { ok: false };

  const user = await auth.isAuthenticated(request);
  if (!user) return { ok: false };

  const guild = await getGuild(params.guildId, true).catch(() => null);
  if (!guild) return { ok: false };

  const res = await Promise.all([
    getRoles(params.guildId),
    getGuildMember(params.guildId, user.id),
  ]).catch(() => null);

  if (!res) return { ok: false };

  const [roles, member] = res;

  const isOwner = guild.owner_id === user.id;
  const hasAdminRole = roles
    .filter((role) => member.roles.includes(role.id))
    .some((role) => hasPermission(role.permissions, Discord.Permissions.ManageGuild));

  if (isOwner || hasAdminRole) {
    return {
      ok: true,
      data: { user, roles, guild },
    };
  }

  return { ok: false };
}

/** 設定モデルを更新 */
export async function updateConfig(
  request: Request,
  params: Params<string>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  model: Model<any>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  schema: ZodEffects<ZodTypeAny> | ZodObject<any>,
) {
  try {
    if (!isSnowflake(params.guildId)) throw new Error('INVALID_GUILD_ID');

    const { ok } = await hasAccessPermission(request, params);
    if (!ok) throw new Error('MISSING_PERMISSION');

    const { errors, data } = await getValidatedFormData<z.infer<typeof schema>>(
      request,
      zodResolver(schema),
    );
    if (errors) throw new Error('INVALID_FORM_DATA');

    await model.findOneAndUpdate(
      { guildId: params.guildId },
      { $set: data },
      { upsert: true, new: true },
    );

    return {
      ok: true,
      message: '設定を保存しました！',
      data,
    };
  } catch (e) {
    return {
      ok: false,
      message: `設定の保存に失敗しました。\n${e}`,
      data: undefined,
    };
  }
}
