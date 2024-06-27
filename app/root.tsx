import { Links, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react';
import './tailwind.css';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <NextUIProvider>
          <ThemeProvider attribute='class' defaultTheme='dark'>
            {children}
            <ScrollRestoration />
            <Scripts />
          </ThemeProvider>
        </NextUIProvider>
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
