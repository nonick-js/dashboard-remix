import type { LoaderFunctionArgs } from '@remix-run/node';
import { Await, type MetaFunction, defer, useLoaderData, useRouteError } from '@remix-run/react';
import { Suspense, useState } from 'react';
import { auth } from '~/.server/auth';
import { getMutualManagedGuilds } from '~/.server/discord';
import { ErrorAlert } from '~/components/error-alert';
import { Header, HeaderDescription, HeaderTitle } from '~/components/header';
import { FilterValueContext } from './contexts';
import { GuildList, GuildListSkeleton } from './guild-list';
import { Navbar } from './navbar';
import { Toolbar, ToolbarSkeleton } from './toolbar';

export const meta: MetaFunction = () => {
  return [{ title: 'サーバー選択 - NoNICK.js' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' });
  const guildsPromise = getMutualManagedGuilds(user.accessToken);

  return defer({ user, guilds: guildsPromise }, { headers: { 'Cache-Control': 'no-store' } });
};

export default function DashboardPage() {
  const { user, guilds } = useLoaderData<typeof loader>();
  const [value, setValue] = useState('');

  return (
    <>
      <Navbar user={user} />
      <div className='container flex flex-col gap-6 pb-6'>
        <Header>
          <HeaderTitle>サーバー選択</HeaderTitle>
          <HeaderDescription>
            NoNICK.jsの設定を行いたいサーバーを選択してください。
          </HeaderDescription>
        </Header>
        <FilterValueContext.Provider value={{ value, setValue }}>
          <Suspense
            fallback={
              <>
                <ToolbarSkeleton />
                <GuildListSkeleton />
              </>
            }
          >
            <Await resolve={guilds}>
              {(guilds) => (
                <>
                  <Toolbar />
                  <GuildList guilds={guilds} />
                </>
              )}
            </Await>
          </Suspense>
        </FilterValueContext.Provider>
      </div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <>
      <Navbar />
      <div className='w-full h-[calc(100dvh_-_80px)] flex items-center justify-center '>
        <ErrorAlert error={error} />
      </div>
    </>
  );
}
