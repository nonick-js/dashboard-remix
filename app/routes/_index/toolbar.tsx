import { Icon } from '@iconify/react';
import { Button, Input, Skeleton, Tooltip } from '@nextui-org/react';
import { useRevalidator } from '@remix-run/react';
import { useContext } from 'react';
import { FilterValueContext } from './contexts';

export function Toolbar({ isDisabledInput }: { isDisabledInput?: boolean }) {
  const { value, setValue } = useContext(FilterValueContext);
  const revalidator = useRevalidator();

  return (
    <div className='flex w-full gap-3 justify-end'>
      <Input
        classNames={{ base: 'flex-1', label: 'hidden' }}
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
      <Tooltip content='一覧を更新'>
        <Button
          color='primary'
          onClick={() => revalidator.revalidate()}
          isLoading={revalidator.state === 'loading'}
          disableRipple
          isIconOnly
        >
          {revalidator.state === 'idle' && (
            <Icon icon='solar:refresh-outline' className='text-[20px]' />
          )}
        </Button>
      </Tooltip>
    </div>
  );
}

export function ToolbarSkeleton() {
  return (
    <div className='flex w-full gap-3'>
      <Skeleton className='h-[40px] flex-1 rounded-medium' />
      <Button className='rounded-medium' color='primary' isDisabled isIconOnly>
        <Icon icon='solar:refresh-outline' className='text-[20px]' />
      </Button>
    </div>
  );
}
