import chalk from 'chalk';
import type {
  APIGuild,
  APIRole,
  RESTAPIPartialCurrentUserGuild,
  RESTRateLimit,
} from 'discord-api-types/v10';
import { Discord } from '~/libs/constants';
import { Guild } from '~/libs/database/models';
import { hasPermission, wait } from '~/libs/utils';
import type { GuildChannelWithoutThread } from '~/types/discord';
import { dbConnect } from './mongoose';

const { Endpoints, Permissions } = Discord;

/** Discordサーバーのチャンネルを取得 */
export async function getChannels(guildId: string) {
  const res = await fetchWithDiscordRateLimit(`${Endpoints.API}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
  });

  if (!res.ok) throw new Error(res.statusText);
  return await res.json<GuildChannelWithoutThread[]>();
}

/** Discordサーバーのロールを取得 */
export async function getRoles(guildId: string) {
  const res = await fetchWithDiscordRateLimit(`${Endpoints.API}/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
  });

  if (!res.ok) throw new Error(res.statusText);
  return await res.json<APIRole[]>();
}

/** Discordサーバーを取得 */
export async function getGuild(guildId: string, withCounts = false) {
  const res = await fetchWithDiscordRateLimit(
    `${Endpoints.API}/guilds/${guildId}?with_counts=${withCounts}`,
    {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` },
    },
  );

  if (!res.ok) throw new Error(res.statusText);
  return await res.json<APIGuild>();
}

/** ユーザーが参加しているDiscordサーバーを取得 */
export async function getUserGuilds(accessToken: string) {
  const res = await fetchWithDiscordRateLimit(`${Endpoints.API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(res.statusText);
  return await res.json<RESTAPIPartialCurrentUserGuild[]>();
}

/** Botとユーザーが参加しているDiscordサーバーを取得 */
export async function getMutualGuilds(accessToken: string) {
  await dbConnect();

  const userGuilds = await getUserGuilds(accessToken);
  const mutualGuildIds = await Guild.find({
    guildId: { $in: userGuilds.map((guild) => guild.id) },
  }).then((guilds) => guilds.map((guild) => guild.guildId));

  return userGuilds.filter((guild) => mutualGuildIds.includes(guild.id));
}

/** ユーザーが`MANAGED_GUILD`権限を所持しており、Botとユーザーが参加しているDiscordサーバーを取得 */
export async function getMutualManagedGuilds(accessToken: string) {
  const mutualGuilds = await getMutualGuilds(accessToken);

  return mutualGuilds.filter((guild) => hasPermission(guild.permissions, Permissions.ManageGuild));
}

/** `fetch()`を拡張した関数 レート制限によりリクエストが拒否された場合、`retry_after`秒待機した後に再度リクエストを行う。 */
async function fetchWithDiscordRateLimit(
  input: URL | RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 429) {
    const data = await res.json<RESTRateLimit>();
    const retryAfter = Math.ceil(data.retry_after);

    if (data.global) {
      throw new Error('Global Rate Limit Exceeded');
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(
        [
          chalk.yellow.bold('[429]'),
          chalk.white(`${retryAfter}秒後に再試行します...`),
          chalk.dim(`(${input.toString()})`),
        ].join(' '),
      );
    }

    await wait(retryAfter * 1000);
    return await fetchWithDiscordRateLimit(input, init);
  }

  return res;
}
