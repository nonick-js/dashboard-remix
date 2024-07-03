import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from '@nextui-org/react';
import { Logo } from '~/components/logo';
import { SidebarGuildSelect } from './sidebar-guild-select';
import { SidebarNavigation } from './sidebar-navigation';

export function NavbarSidebar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} isIconOnly disableRipple className='lg:hidden' variant='flat'>
        <Icon icon='basil:menu-outline' className='text-[25px]' />
      </Button>
      <Modal
        classNames={{ wrapper: ' justify-start', base: 'sm:mx-0 sm:my-0' }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        motionProps={{
          variants: {
            enter: {
              x: 0,
              transition: { duration: 0.3 },
            },
            exit: {
              x: '-100%',
              transition: { duration: 0.4 },
            },
          },
        }}
      >
        <ModalContent className='w-auto h-dvh rounded-l-none m-0'>
          {(onClose) => (
            <>
              <ModalHeader className='w-[280px] h-[60px] px-0 mx-6 '>
                <Logo className='mt-2' width={120} />
              </ModalHeader>
              <ModalBody className='flex-1 px-0 mx-6 w-[280px] h-[calc(100dvh_-_80px)]'>
                <ScrollShadow className='flex flex-col gap-4 pb-6' hideScrollBar>
                  <SidebarGuildSelect />
                  <SidebarNavigation onNavigate={onClose} />
                </ScrollShadow>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
