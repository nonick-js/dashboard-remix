import { type LoaderFunction, redirect } from '@remix-run/node';
import { Discord } from '~/libs/constants';

export const loader: LoaderFunction = async () => {
  return redirect(
    `${Discord.Endpoints.API}/oauth2/authorize?${new URLSearchParams({
      client_id: process.env.DISCORD_ID,
      permissions: process.env.DISCORD_PERMISSION,
      redirect_uri: process.env.BASE_URL,
      response_type: 'code',
      scope: 'bot',
    })}`,
  );
};
