import chalk from 'chalk';
import type { RESTAPIPartialCurrentUserGuild, RESTRateLimit } from 'discord-api-types/v10';
import { Discord } from '~/libs/constants';
import { Guild } from '~/libs/database/models';
import { hasPermission, wait } from '~/libs/utils';
import { dbConnect } from './mongoose';

export async function getUserGuilds(accessToken: string) {
  const res = await fetchWithDiscordRateLimit(`${Discord.Endpoints.API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error(res.statusText);
  return await res.json<RESTAPIPartialCurrentUserGuild[]>();
}

export async function getMutualGuilds(accessToken: string) {
  await dbConnect();

  const userGuilds = await getUserGuilds(accessToken);
  const mutualGuildIds = await Guild.find({
    guildId: { $in: userGuilds.map((guild) => guild.id) },
  }).then((guilds) => guilds.map((guild) => guild.guildId));

  return userGuilds.filter((guild) => mutualGuildIds.includes(guild.id));
}

export async function getManagedMutualGuilds(accessToken: string) {
  const mutualGuilds = await getMutualGuilds(accessToken);

  return mutualGuilds.filter((guild) =>
    hasPermission(guild.permissions, Discord.Permissions.ManageGuild),
  );
}

async function fetchWithDiscordRateLimit(
  input: URL | RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(input, init);

  if (res.status === 429) {
    const data = await res.json<RESTRateLimit>();
    const retryAfter = Math.ceil(data.retry_after);

    if (process.env.NODE_ENV === 'development') {
      console.log(
        [
          chalk.yellow.bold('[Too Many Requests]'),
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
