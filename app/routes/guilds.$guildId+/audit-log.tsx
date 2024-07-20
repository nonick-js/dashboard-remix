import { Avatar } from '@nextui-org/react';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { type MetaFunction, json, redirect, useLoaderData } from '@remix-run/react';
import React from 'react';
import { z } from 'zod';
import { hasAccessPermission } from '~/.server/dashboard';
import { getChannels, getUser } from '~/.server/discord';
import { Header, HeaderTitle } from '~/components/header';
import { AuditLog } from '~/libs/database/models';

// #region Page
export const meta: MetaFunction = () => {
  return [{ title: '監査ログ - NoNICK.js' }];
};

export const loader = async (args: LoaderFunctionArgs) => {
  const { ok, data } = await hasAccessPermission(args);
  if (!ok) return redirect('/');

  const auditLogs = await AuditLog.find({ guildId: data.guild.id });
  // 後にcreateAtの値によってフィルターさせる
  const authorIdSet = new Set<string>();
  for (const log of auditLogs) {
    authorIdSet.add(log.authorId);
  }

  const authors = await Promise.all(Array.from(authorIdSet).map((id) => getUser(id)));
  const roles = data.roles;
  const channels = await getChannels(data.guild.id);

  return json(
    { auditLogs: auditLogs, authors, roles, channels },
    { headers: { 'Cache-Control': 'no-store' } },
  );
};

export default function Page() {
  return (
    <>
      <Header>
        <HeaderTitle>監査ログ</HeaderTitle>
      </Header>
    </>
  );
}
// #endregion
