import {
  type ActionFunction,
  type ActionFunctionArgs,
  type LoaderFunction,
  redirect,
} from '@remix-run/node';
import { auth } from '~/.server/auth';

export const loader: LoaderFunction = async () => {
  return redirect('/');
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  return await auth.logout(request, { redirectTo: '/login' });
};
