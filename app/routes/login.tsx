import { Icon } from '@iconify-icon/react/dist/iconify.js';
import { Button, Card, Link } from '@nextui-org/react';
import type { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Form, type MetaFunction } from '@remix-run/react';
import { useState } from 'react';
import { auth } from '~/.server/auth';
import { Logo } from '~/components/logo';

export const meta: MetaFunction = () => {
  return [{ title: 'ログイン' }];
};

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  return await auth.isAuthenticated(request, { successRedirect: '/' });
};

export default function Page() {
  return (
    <div className='container h-dvh flex items-center justify-center'>
      <Card className='max-w-[400px] flex flex-col gap-6 p-6'>
        <Logo width={130} />
        <Header />
        <AuthForm />
        <Footer />
      </Card>
    </div>
  );
}

function Header() {
  return (
    <div className='flex flex-col'>
      <p className='text-xl font-medium'>ログインが必要です</p>
      <p className='text-sm text-default-500'>Discordアカウントを使用して続行</p>
    </div>
  );
}

function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Form
      onSubmit={() => setIsLoading(true)}
      action='/auth'
      method='post'
      className='flex flex-col gap-3'
    >
      <Button
        type='submit'
        color='primary'
        startContent={!isLoading && <Icon icon='ic:baseline-discord' className='text-[20px]' />}
        isLoading={isLoading}
        fullWidth
        disableRipple
      >
        Discordでログイン
      </Button>
      <Button
        as={Link}
        href='https://docs.nonick-js.com/nonick-js/how-to-login'
        variant='flat'
        fullWidth
        disableRipple
      >
        ログインについて
      </Button>
    </Form>
  );
}

function Footer() {
  return (
    <p className='text-sm leading-none text-default-500'>
      ログインすることで、NoNICK.jsの
      <Link
        size='sm'
        href='https://docs.nonick-js.com/important/teams-of-service/'
        isExternal
        showAnchorIcon
      >
        利用規約
      </Link>
      および
      <Link
        size='sm'
        href='https://docs.nonick-js.com/important/privacy-policy'
        isExternal
        showAnchorIcon
      >
        プライバシーポリシー
      </Link>
      に同意したとみなされます。
    </p>
  );
}
