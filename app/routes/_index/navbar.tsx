import { NavbarBrand, NavbarContent, Navbar as NextUINavbar } from '@nextui-org/navbar';
import type { DiscordUser } from '~/.server/auth';
import { Logo } from '~/components/logo';
import { ThemeToggle } from '~/components/theme-toggle';
import { UserDropdown } from '~/components/user-dropdown';

export function Navbar({ user }: { user?: DiscordUser }) {
  return (
    <NextUINavbar classNames={{ base: 'h-20', wrapper: 'max-w-[90rem]' }}>
      <NavbarBrand>
        <Logo height={18} />
      </NavbarBrand>
      <NavbarContent className='flex gap-2 items-center' justify='end'>
        <ThemeToggle />
        {user && <UserDropdown user={user} />}
      </NavbarContent>
    </NextUINavbar>
  );
}
