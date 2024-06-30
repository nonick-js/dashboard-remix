// import { ThemeSwitch } from '@/components/theme-switch';
import { NavbarBrand, NavbarContent, NavbarItem, Navbar as NextUINavbar } from '@nextui-org/navbar';
import type { DiscordUser } from '~/.server/auth';
import { Logo } from '~/components/logo';
import { UserDropdown } from '~/components/user-dropdown';

export function Navbar({ user }: { user: DiscordUser }) {
  return (
    <NextUINavbar maxWidth='xl'>
      <NavbarBrand>
        <Logo width={120} />
      </NavbarBrand>
      <NavbarContent className='flex gap-4 items-center' justify='end'>
        {/* <ThemeSwitch /> */}
        <UserDropdown user={user} />
      </NavbarContent>
    </NextUINavbar>
  );
}
