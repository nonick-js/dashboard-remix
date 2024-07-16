import { zodResolver } from '@hookform/resolvers/zod';
import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import type { APIGuild, APIRole } from 'discord-api-types/v10';
import type { Model } from 'mongoose';
import { getValidatedFormData } from 'remix-hook-form';
import type * as z from 'zod';
import type { ZodEffects, ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import { Discord } from '~/libs/constants';
import { Snowflake } from '~/libs/database/zod/discord';
import { hasPermission } from '~/libs/utils';
import type { ActionResult } from '~/types';
import { type DiscordUser, auth } from './auth';
import { getGuild, getGuildMember, getRoles } from './discord';

type HasAccessPermissonRes =
  | { ok: true; data: { user: DiscordUser; roles: APIRole[]; guild: APIGuild }; error?: undefined }
  | { ok: false; data?: undefined; error: string };

/** 値がSnowflakeの基準を満たしているか確認 */
export function isSnowflake(id: unknown): id is string {
  const { success } = Snowflake.safeParse(id);
  return success;
}

/** ダッシュボードのアクセス権限を持っているか確認 */
export async function hasAccessPermission(
  args: LoaderFunctionArgs | ActionFunctionArgs,
): Promise<HasAccessPermissonRes> {
  try {
    if (!isSnowflake(args.params.guildId)) throw new Error('Invalid GuildId');

    const user = await auth.isAuthenticated(args.request);
    if (!user) throw new Error('Unauthorized');

    const guild = await getGuild(args.params.guildId, true);

    const res = await Promise.all([
      getRoles(args.params.guildId),
      getGuildMember(args.params.guildId, user.id),
    ]);

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

    return { ok: false, error: 'Missing Permissions' };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/** 設定モデルを更新 */
export async function updateConfig(
  args: ActionFunctionArgs,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  model: Model<any>,
  schema: ZodEffects<ZodTypeAny> | ZodObject<ZodRawShape>,
): Promise<ActionResult> {
  try {
    const { ok, error } = await hasAccessPermission(args);
    if (!ok) throw new Error(error);

    const { errors, data } = await getValidatedFormData<z.infer<typeof schema>>(
      args.request,
      zodResolver(schema),
    );
    if (errors) throw new Error('Invalid Form Data');

    await model.updateOne({ guildId: args.params.guildId }, { $set: data }, { upsert: true });

    return { ok: true, message: '設定を保存しました！' };
  } catch (e) {
    return { ok: false, message: `設定の保存に失敗しました。\n${e}` };
  }
}
