import { Code } from '@nextui-org/react';
import { type LoaderFunction, json, redirect } from '@remix-run/node';
import { type MetaFunction, useLoaderData } from '@remix-run/react';
import type { APIGuild } from 'discord-api-types/v10';
import { checkAccessPermission, isSnowflake } from '~/.server/dashboard';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { GuildInfoCard } from './guild-info';

type LoaderData = {
  guild: APIGuild;
};

export const meta: MetaFunction = () => {
  return [{ title: 'ダッシュボード - NoNICK.js' }];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!isSnowflake(params.guildId)) return redirect('/');
  const { user, guild } = await checkAccessPermission(request, params.guildId);

  return json({ user, guild }, { headers: { 'Cache-Control': 'no-store' } });
};

export default function Page() {
  const { guild } = useLoaderData<LoaderData>();

  return (
    <>
      <GuildInfoCard guild={guild} />
      <Alert variant='info'>
        <AlertTitle>
          <Code>v5.2</Code>
          から、メンバー数やメッセージ数の増減をこのページで確認できるようになります。
        </AlertTitle>
      </Alert>
    </>
  );
}
