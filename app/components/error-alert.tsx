import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import { Button } from '@nextui-org/react';
import { isRouteErrorResponse, useLocation, useNavigate } from '@remix-run/react';

export function ErrorAlert({ error }: { error: unknown }) {
  const navigate = useNavigate();
  const location = useLocation();

  if (isRouteErrorResponse(error)) {
    console.error(`${error.status}: ${error.statusText}`);
  } else if (error instanceof Error) {
    console.error(error.message);
  }

  return (
    <div className='flex flex-col items-center gap-4'>
      <Icon
        icon='solar:danger-triangle-bold-duotone'
        className='text-warning text-[150px] sm:text-[180px]'
      />
      <div className='text-center'>
        <h1 className='text-2xl sm:text-3xl font-bold mb-2'>問題が発生しました</h1>
        <p className='text-lg text-default-500'>時間をおいて再度アクセスしてください</p>
      </div>
      <div className='flex gap-3'>
        <Button
          onClick={() => navigate(location.pathname, { replace: true })}
          color='primary'
          startContent={<Icon icon='solar:refresh-outline' className='text-[20px]' />}
        >
          再試行
        </Button>
      </div>
    </div>
  );
}
