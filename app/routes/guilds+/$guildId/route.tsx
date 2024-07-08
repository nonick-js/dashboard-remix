import type { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, type ShouldRevalidateFunctionArgs, json } from '@remix-run/react';
import { auth } from '~/.server/auth';
import { getMutualManagedGuilds } from '~/.server/discord';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';

export const shouldRevalidate = ({
  actionResult,
  defaultShouldRevalidate,
}: ShouldRevalidateFunctionArgs) => {
  if (actionResult) return false;
  return defaultShouldRevalidate;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await auth.isAuthenticated(request, { failureRedirect: '/login' });
  const guilds = await getMutualManagedGuilds(user.accessToken);

  return json(
    { user, guilds },
    { headers: { 'Cache-Control': 'private, max-age=60, must-revalidate' } },
  );
};

export default function Layout() {
  return (
    <div className='container flex gap-8'>
      <Sidebar className='sticky top-0 max-lg:hidden' />
      <div className='flex-1'>
        <Navbar />
        <div className='flex flex-col gap-6'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
