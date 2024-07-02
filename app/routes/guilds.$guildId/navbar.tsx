import { NavbarBrand, NavbarContent, Navbar as NextUINavbar } from '@nextui-org/navbar';
import { Link } from '@remix-run/react';
import type { DiscordUser } from '~/.server/auth';
import { Logo } from '~/components/logo';
import { ThemeToggle } from '~/components/theme-toggle';
import { UserDropdown } from '~/components/user-dropdown';
import { NavbarSidebar } from './navbar-sidebar';

export function Navbar({ user }: { user?: DiscordUser }) {
  return (
    <NextUINavbar maxWidth='xl'>
      <NavbarSidebar />
      <NavbarBrand>
        <Link to='/'>
          <Logo width={120} />
        </Link>
      </NavbarBrand>
      <NavbarContent className='flex gap-2 items-center' justify='end'>
        <ThemeToggle />
        {user && <UserDropdown user={user} />}
      </NavbarContent>
    </NextUINavbar>
  );
}
