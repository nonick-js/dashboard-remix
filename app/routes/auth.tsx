import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { auth } from '~/.server/auth';

export const loader: LoaderFunction = () => redirect('/login');

export const action: ActionFunction = ({ request }) => {
  return auth.authenticate('discord', request);
};
