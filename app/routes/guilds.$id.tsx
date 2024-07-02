import { Button } from '@nextui-org/react';
import type { LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const loader: LoaderFunction = async () => {
  return null;
};

export default function Page() {
  return (
    <div className='container py-6'>
      <h1>設定ページ (仮)</h1>
      <Button as={Link} to='/' color='primary'>
        戻る
      </Button>
    </div>
  );
}
