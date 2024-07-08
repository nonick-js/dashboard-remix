import { Code } from '@nextui-org/react';
import { type LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { type MetaFunction, useLoaderData } from '@remix-run/react';
import { hasAccessPermission, isSnowflake } from '~/.server/dashboard';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { GuildInfoCard } from './guild-info';

export const meta: MetaFunction = () => {
  return [{ title: 'ダッシュボード - NoNICK.js' }];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  if (!isSnowflake(params.guildId)) return redirect('/');

  const { ok, data } = await hasAccessPermission(request, params.guildId);
  if (!ok) return redirect('/');

  const guild = data.guild;

  return json({ guild }, { headers: { 'Cache-Control': 'no-store' } });
};

export default function Page() {
  const { guild } = useLoaderData<typeof loader>();

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
