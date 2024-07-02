import { Icon } from '@iconify-icon/react/dist/iconify.js';
import { Button, Input, Skeleton } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import { useContext } from 'react';
import { FilterValueContext } from './contexts';

export function Toolbar({ isDisabledInput }: { isDisabledInput?: boolean }) {
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
        isDisabled={isDisabledInput}
      />
      <Button
        as={Link}
        to='/new'
        className='rounded-medium w-full sm:w-[160px]'
        color='primary'
        startContent={<Icon icon='solar:add-circle-bold' className='text-[20px]' />}
        disableRipple
      >
        サーバーを追加
      </Button>
    </div>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className='flex flex-col sm:flex-row w-full gap-3 sm:gap-2'>
      <Skeleton className='h-[40px] sm:flex-1 rounded-medium' />
      <Button
        className='rounded-medium w-full sm:w-[160px]'
        color='primary'
        startContent={<Icon icon='solar:add-circle-bold' className='text-[20px]' />}
        isDisabled
      >
        サーバーを追加
      </Button>
    </div>
  );
}
