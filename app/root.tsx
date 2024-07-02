import './tailwind.css';
import { NextUIProvider } from '@nextui-org/react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import { ThemeProvider } from 'next-themes';
import { ConsoleWarningProvider } from './components/console-warn';

export function Layout({ children }: { children: React.ReactNode }) {
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
        <NextUIProvider>
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
    <main>
      <Outlet />
    </main>
  );
}
