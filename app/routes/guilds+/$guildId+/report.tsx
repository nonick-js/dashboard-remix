import type { MetaFunction } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'サーバー内通報 - NoNICK.js' }];
};

export default function Page() {
  return (
    <div>
      <h1>サーバー内通報</h1>
    </div>
  );
}
