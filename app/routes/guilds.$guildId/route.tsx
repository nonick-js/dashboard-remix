import type { HeadersFunction, LoaderFunction } from '@remix-run/node';
import { Outlet, json, redirect, useLoaderData } from '@remix-run/react';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { type DiscordUser, auth } from '~/.server/auth';
import { getManagedMutualGuilds } from '~/.server/discord';
import { Snowflake } from '~/libs/database/zod/discord';
import { ManagedMutualGuildsContext } from './contexts';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

export const headers: HeadersFunction = () => ({
  'Cache-Control': 'no-store',
});

type LoaderResult = {
  user: DiscordUser;
  guilds: RESTAPIPartialCurrentUserGuild[];
};

export const loader: LoaderFunction = async ({ params: { guildId }, request }) => {
  if (!Snowflake.safeParse(guildId).success) {
    return redirect('/');
  }

  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' });
  const guilds = await getManagedMutualGuilds(user.accessToken);

  return json({ user, guilds });
};

export default function Page() {
  const { user, guilds } = useLoaderData<LoaderResult>();

  return (
    <ManagedMutualGuildsContext.Provider value={guilds}>
      <Navbar user={user} />
      <div className='container flex gap-6'>
        <Sidebar />
        <div className='flex-1 flex flex-col gap-6 pt-3'>
          <Outlet />
        </div>
      </div>
    </ManagedMutualGuildsContext.Provider>
  );
}
