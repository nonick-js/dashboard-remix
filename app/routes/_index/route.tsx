import type { LoaderFunction } from '@remix-run/node';
import { type MetaFunction, json, useLoaderData } from '@remix-run/react';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { useState } from 'react';
import { type DiscordUser, auth } from '~/.server/auth';
import { getMutualGuilds } from '~/.server/discord';
import { Header, HeaderDescription, HeaderTitle } from '~/components/header';
import { Discord } from '~/libs/constants';
import { hasPermission } from '~/libs/utils';
import { FilterValueContext } from './contexts';
import { GuildList } from './guild-list';
import { Navbar } from './navbar';
import { Toolbar } from './toolbar';

type LoaderResult = {
  user: DiscordUser;
  guilds: RESTAPIPartialCurrentUserGuild[];
};

export const meta: MetaFunction = () => {
  return [{ title: 'サーバー選択' }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });

  const mutualGuilds = await getMutualGuilds(user.accessToken);
  const adminGuilds = mutualGuilds.filter((guild) =>
    hasPermission(guild.permissions, Discord.Permissions.ManageGuild),
  );

  return json(
    { user, guilds: adminGuilds },
    { headers: { 'Cache-Control': 'max-age=10, private' } },
  );
};

export default function DashboardPage() {
  const { user, guilds } = useLoaderData<LoaderResult>();
  const [value, setValue] = useState('');

  return (
    <>
      <Navbar user={user} />
      <div className='container flex flex-col gap-6 pt-3'>
        <Header>
          <HeaderTitle>サーバー選択</HeaderTitle>
          <HeaderDescription>
            NoNICK.jsの設定を行いたいサーバーを選択してください。
          </HeaderDescription>
        </Header>
        <FilterValueContext.Provider value={{ value, setValue }}>
          <Toolbar />
          <GuildList guilds={guilds} />
        </FilterValueContext.Provider>
      </div>
    </>
  );
}
