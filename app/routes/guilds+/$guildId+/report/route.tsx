import { type ActionFunctionArgs, type LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import type { MetaFunction, ShouldRevalidateFunctionArgs } from '@remix-run/react';
import { hasAccessPermission, updateConfig } from '~/.server/dashboard';
import { getChannels } from '~/.server/discord';
import { Header, HeaderDescription, HeaderTitle } from '~/components/header';
import * as model from '~/libs/database/models';
import * as schema from '~/libs/database/zod/config';
import { Form } from './form';

export const meta: MetaFunction = () => {
  return [{ title: 'サーバー内通報 - NoNICK.js' }];
};

export const shouldRevalidate = ({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) => {
  if (actionResult) return false;
  return defaultShouldRevalidate;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { ok, data } = await hasAccessPermission(request, params);
  if (!ok) return redirect('/');

  const roles = data.roles;
  const [channels, config] = await Promise.all([
    getChannels(data.guild.id),
    model.ReportConfig.findOne({ guildId: params.guildId }),
  ]);

  return json({ roles, channels, config }, { headers: { 'Cache-Control': 'no-store' } });
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const res = await updateConfig(request, params, model.ReportConfig, schema.ReportConfig);
  return json(res);
};

export default function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>サーバー内通報</HeaderTitle>
        <HeaderDescription>
          不適切なメッセージやユーザーをメンバーが通報できるようにします。
        </HeaderDescription>
      </Header>
      <Form />
    </>
  );
}
