import { Avatar, Card, Skeleton } from '@nextui-org/react';
import { Link } from '@remix-run/react';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { Discord } from '~/libs/constants';
import { truncateString } from '~/libs/utils';

export function GuildCard({ guild }: { guild: RESTAPIPartialCurrentUserGuild }) {
  return (
    <Link className='col-span-12 sm:col-span-6 lg:col-span-3' to={`/guilds/${guild.id}`}>
      <Card className='overflow-hidden h-full' fullWidth isPressable>
        <div className='w-full flex items-center justify-center h-28'>
          <Avatar
            name={truncateString(guild.name, 15)}
            src={
              guild.icon
                ? `${Discord.Endpoints.CDN}/icons/${guild.id}/${guild.icon}.png`
                : undefined
            }
            classNames={{ base: 'w-[70px] h-[70px]', name: 'text-lg' }}
            alt={`${guild.name}のサーバーアイコン`}
            showFallback
          />
        </div>
        <div className='w-full min-h-12 flex flex-1 justify-center items-center p-3 bg-content2 line-clamp-2'>
          <p>{truncateString(guild.name, 15)}</p>
        </div>
      </Card>
    </Link>
  );
}

export function GuildCardSkeleton() {
  return (
    <Card className={'col-span-12 sm:col-span-6 lg:col-span-3 overflow-hidden h-full'} fullWidth>
      <div className='w-full flex items-center justify-center h-28'>
        <Skeleton className='w-[70px] h-[70px] rounded-full' />
      </div>
      <div className='w-full flex flex-1 justify-center items-center'>
        <Skeleton className='w-full h-12' />
      </div>
    </Card>
  );
}
