import { redirect } from '@remix-run/react';
import { Discord } from '~/libs/constants';
import { Snowflake } from '~/libs/database/zod/discord';
import { hasPermission } from '~/libs/utils';
import { auth } from './auth';
import { getGuild, getGuildMember, getRoles } from './discord';

/** 値がSnowflakeの基準を満たしているか確認 */
export function isSnowflake(id: unknown): id is string {
  const { success } = Snowflake.safeParse(id);
  return success;
}

/** ダッシュボードのアクセス権限を持っているか確認（所持していない場合は`/`にリダイレクト）*/
export async function checkAccessPermission(request: Request, guildId: string) {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/' });

  const guild = await getGuild(guildId, true).catch(() => null);
  if (!guild) throw redirect('/');

  const roles = await getRoles(guildId).catch(() => null);
  const member = await getGuildMember(guildId, user.id).catch(() => null);
  if (!roles || !member) throw redirect('/');

  const isOwner = guild.owner_id === user.id;
  const hasAdminRole = roles
    .filter((role) => member.roles.includes(role.id))
    .some((role) => hasPermission(role.permissions, Discord.Permissions.ManageGuild));

  if (isOwner || hasAdminRole) return { user, guild, roles };

  throw redirect('/');
}
