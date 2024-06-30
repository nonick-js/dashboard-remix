import { Button } from '@nextui-org/react';
import type { LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { type DiscordUser, auth } from '~/.server/auth';

export const loader: LoaderFunction = async ({ request }) => {
  return await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  });
};

export default function DashboardPage() {
  const user = useLoaderData<DiscordUser>();
  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome {user.globalName}</h2>
      <Form action='/logout' method='post'>
        <Button type='submit'>ログアウト</Button>
      </Form>
    </div>
  );
}
