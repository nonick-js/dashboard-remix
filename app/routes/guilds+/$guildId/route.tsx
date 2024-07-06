import type { LoaderFunction } from '@remix-run/node';
import { Outlet, json, useLoaderData } from '@remix-run/react';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { type DiscordUser, auth } from '~/.server/auth';
import { getMutualManagedGuilds } from '~/.server/discord';
import { ManagedMutualGuildsContext } from './contexts';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

type LoaderResult = {
  user: DiscordUser;
  guilds: RESTAPIPartialCurrentUserGuild[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' });
  const guilds = await getMutualManagedGuilds(user.accessToken);

  return json(
    { user, guilds },
    { headers: { 'Cache-Control': 'private, max-age=60, must-revalidate' } },
  );
};

export default function Layout() {
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
