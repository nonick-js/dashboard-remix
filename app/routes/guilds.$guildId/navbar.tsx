import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { NavbarBrand, NavbarContent, Navbar as NextUINavbar } from '@nextui-org/navbar';
import { Button, Modal, ModalContent, useDisclosure } from '@nextui-org/react';
import { Link, useLoaderData } from '@remix-run/react';
import { Logo } from '~/components/logo';
import { ThemeToggle } from '~/components/theme-toggle';
import { UserDropdown } from '~/components/user-dropdown';
import type { loader } from './route';
import { Sidebar } from './sidebar';

export function Navbar() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <NextUINavbar maxWidth='xl' classNames={{ base: 'h-20', wrapper: 'px-0' }}>
      <NavbarSidebar />
      <NavbarBrand className='lg:hidden'>
        <Link to='/'>
          <Logo height={18} />
        </Link>
      </NavbarBrand>
      <NavbarContent className='flex gap-2 items-center' justify='end'>
        <ThemeToggle />
        {user && <UserDropdown user={user} />}
      </NavbarContent>
    </NextUINavbar>
  );
}

export function NavbarSidebar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} isIconOnly disableRipple className='lg:hidden' variant='flat'>
        <Icon icon='basil:menu-outline' className='text-[22px]' />
      </Button>
      <Modal
        classNames={{ wrapper: ' justify-start', base: 'sm:m-0' }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              transition: { duration: 0.3 },
            },
            exit: {
              x: '-200%',
              transition: { duration: 0.4 },
            },
          },
        }}
      >
        <ModalContent className='w-auto h-dvh rounded-l-none m-0'>
          {(onClose) => <Sidebar className='mx-6' onNavigate={onClose} />}
        </ModalContent>
      </Modal>
    </>
  );
}
