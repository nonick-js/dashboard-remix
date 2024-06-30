import { Icon } from '@iconify-icon/react/dist/iconify.js';
import { Button, Input, Link } from '@nextui-org/react';
import { useContext } from 'react';
import { Discord } from '~/libs/constants';
import { FilterValueContext } from './contexts';

export function Toolbar() {
  const { value, setValue } = useContext(FilterValueContext);

  return (
    <div className='flex flex-col sm:flex-row w-full gap-3 sm:gap-2'>
      <Input
        classNames={{ base: 'sm:flex-1', label: 'hidden' }}
        value={value}
        onValueChange={(v) => setValue(v)}
        onClear={() => setValue('')}
        labelPlacement='outside'
        placeholder='名前またはサーバーIDで検索'
        startContent={
          <Icon icon='solar:magnifer-outline' className='text-default-500 text-[20px]' />
        }
        isClearable
      />
      <Button
        as={Link}
        href={'/new'}
        className='rounded-medium w-full sm:w-auto'
        color='primary'
        startContent={<Icon icon='solar:add-circle-bold' className='text-[20px]' />}
        disableRipple
        isExternal
      >
        サーバーを追加
      </Button>
    </div>
  );
}
