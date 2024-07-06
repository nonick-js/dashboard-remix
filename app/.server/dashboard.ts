import { redirect } from '@remix-run/react';
import { Snowflake } from '~/libs/database/zod/discord';
import { auth } from './auth';
import { getMutualManagedGuilds } from './discord';

/** 値がSnowflakeの基準を満たしているか確認 */
export function isSnowflake(id: unknown): id is string {
  const { success } = Snowflake.safeParse(id);
  return success;
}

/** ダッシュボードのアクセス権限を持っているか確認（所持していない場合は`/`にリダイレクト）*/
export async function hasAccessPermission(request: Request, guildId?: string) {
  if (!isSnowflake(guildId)) throw redirect('/');

  const user = await auth.isAuthenticated(request, { failureRedirect: '/' });
  const guilds = await getMutualManagedGuilds(user.accessToken);

  if (!guilds.some((guild) => guild.id === guildId)) {
    throw redirect('/');
  }

  return { user };
}
