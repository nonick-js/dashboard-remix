import { Button } from '@nextui-org/react';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  return (
    <div className='font-sans p-4'>
      <Button>Hello Next.js</Button>
    </div>
  );
}
