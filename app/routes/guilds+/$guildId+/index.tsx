import type { LoaderFunction } from '@remix-run/node';
import { wait } from '~/libs/utils';

export const loader: LoaderFunction = async () => {
  await wait(3000);
  return null;
};

export default function Page() {
  return (
    <>
      <p>ホーム</p>
    </>
  );
}
