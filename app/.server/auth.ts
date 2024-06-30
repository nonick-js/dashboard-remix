import { Authenticator } from 'remix-auth';
import { type DiscordProfile, DiscordStrategy } from 'remix-auth-discord';
import { sessionStorage } from './session';

export interface DiscordUser {
  id: DiscordProfile['id'];
  username: DiscordProfile['__json']['username'];
  globalName: DiscordProfile['__json']['global_name'];
  discriminator: DiscordProfile['__json']['discriminator'];
  avatarUrl: string;
  locale?: string;
  accessToken: string;
  expiresAt: number;
}

export const auth = new Authenticator<DiscordUser>(sessionStorage);

const discordStrategy = new DiscordStrategy(
  {
    clientID: process.env.DISCORD_ID,
    clientSecret: process.env.DISCORD_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/callback`,
    scope: ['identify', 'guilds'],
  },
  async ({ accessToken, extraParams, profile }): Promise<DiscordUser> => {
    let avatarUrl: string;

    if (profile.__json.avatar) {
      const defaultAvatarNumber =
        profile.__json.discriminator === '0'
          ? Number(BigInt(profile.id) >> BigInt(22)) % 6
          : Number.parseInt(profile.__json.discriminator) % 5;
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
    } else {
      const format = profile.__json.avatar?.startsWith('a_') ? 'git' : 'png';
      avatarUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.__json.avatar}.${format}`;
    }

    return {
      id: profile.id,
      username: profile.__json.username,
      globalName: profile.__json.global_name,
      discriminator: profile.__json.discriminator,
      locale: profile.__json.locale,
      expiresAt: Date.now() + extraParams.expires_in * 1000,
      avatarUrl,
      accessToken,
    };
  },
);

auth.use(discordStrategy);
