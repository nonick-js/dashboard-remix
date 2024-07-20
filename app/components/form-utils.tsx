import { DevTool } from '@hookform/devtools';
import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { Button, Card, CardBody, CardHeader, cn } from '@nextui-org/react';
import type { ReactNode } from 'react';
import { useRemixFormContext } from 'remix-hook-form';

export const FormSelectClassNames = {
  multiple: {
    trigger: 'py-2',
    base: 'md:max-w-xs',
  },
  single: {
    base: 'md:max-w-xs',
  },
};

export function FormCard({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <Card>
      {title && (
        <CardHeader className='p-6'>
          <h3 className='text-lg font-semibold'>{title}</h3>
        </CardHeader>
      )}
      <CardBody className={cn('flex flex-col gap-8 p-6', { 'pt-0': title })}>{children}</CardBody>
    </Card>
  );
}

export function FormActionButtons() {
  const { formState, reset } = useRemixFormContext();

  return (
    <div className='flex items-center gap-3 w-full pb-12'>
      <Button
        color='primary'
        type='submit'
        startContent={
          !formState.isSubmitting && <Icon icon='solar:diskette-bold' className='text-[20px]' />
        }
        isLoading={formState.isSubmitting}
        isDisabled={!formState.isDirty}
      >
        変更を保存
      </Button>
      <Button onClick={() => reset()} isDisabled={!formState.isDirty || formState.isSubmitting}>
        リセット
      </Button>
    </div>
  );
}

export function FormDevTool() {
  if (process.env.NODE_ENV !== 'development') return null;

  const form = useRemixFormContext();
  return <DevTool control={form.control} placement='top-left' />;
}
