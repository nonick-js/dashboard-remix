import { NavbarBrand, NavbarContent, Navbar as NextUINavbar } from '@nextui-org/navbar';
import type { DiscordUser } from '~/.server/auth';
import { Logo } from '~/components/logo';
import { ThemeToggle } from '~/components/theme-toggle';
import { UserDropdown } from '~/components/user-dropdown';

export function Navbar({ user }: { user?: DiscordUser }) {
  return (
    <NextUINavbar maxWidth='xl'>
      <NavbarBrand>
        <Logo height={20} />
      </NavbarBrand>
      <NavbarContent className='flex gap-2 items-center' justify='end'>
        <ThemeToggle />
        {user && <UserDropdown user={user} />}
      </NavbarContent>
    </NextUINavbar>
  );
}
