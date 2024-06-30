'use client';

import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { Form } from '@remix-run/react';
import type { DiscordUser } from '~/.server/auth';

export function UserDropdown({ user }: { user: DiscordUser }) {
  return (
    <Dropdown showArrow>
      <DropdownTrigger>
        <Avatar
          as='button'
          size='sm'
          name={user.globalName ?? user.username}
          src={user.avatarUrl}
          showFallback
        />
      </DropdownTrigger>
      <DropdownMenu
        variant='flat'
        aria-label='Discordアカウントの情報を表示するドロップダウン'
        disabledKeys={['profile']}
      >
        <DropdownSection showDivider>
          <DropdownItem key='profile' className='opacity-100' isReadOnly>
            <User
              name={user.globalName ?? user.username}
              description={
                user.discriminator === '0'
                  ? `@${user.username}`
                  : `${user.username}#${user.discriminator}`
              }
              avatarProps={{
                size: 'sm',
                src: user.avatarUrl,
              }}
            />
          </DropdownItem>
        </DropdownSection>
        <DropdownItem key='logout' isReadOnly className='p-0'>
          <Form action='/logout' method='post'>
            <Button
              type='submit'
              className='h-auto rounded-md px-2 py-1.5 justify-start'
              variant='light'
              color='danger'
              startContent={<Icon icon='solar:logout-2-bold' className='text-[18px]' />}
              fullWidth
            >
              ログアウト
            </Button>
          </Form>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
