import './tailwind.css';
import { NextUIProvider } from '@nextui-org/react';
import type { LinksFunction } from '@remix-run/node';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigate } from '@remix-run/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import nprogressStyles from '~/nprogress.css?url';
import { ConsoleWarningProvider } from './components/console-warn';
import { ProgressBar } from './components/progressbar';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: nprogressStyles }];

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <html lang='ja' suppressHydrationWarning>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='font-noteSans'>
        <ConsoleWarningProvider>
          <NextUIProvider navigate={navigate}>
            <ThemeProvider attribute='class' defaultTheme='dark'>
              {children}
              <ScrollRestoration />
              <Scripts />
            </ThemeProvider>
          </NextUIProvider>
        </ConsoleWarningProvider>
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <ProgressBar showSpinner={false} />
      <Toaster position='bottom-right' toastOptions={{ duration: 6000 }} />
    </>
  );
}
