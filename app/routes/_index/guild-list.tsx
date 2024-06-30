import { Icon } from '@iconify-icon/react/dist/iconify.js';
import type { RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import { useContext } from 'react';
import { FilterValueContext } from './contexts';
import { GuildCard } from './guild-card';

export function GuildList({ guilds }: { guilds: RESTAPIPartialCurrentUserGuild[] }) {
  const { value } = useContext(FilterValueContext);

  const filteredGuilds = guilds.filter(
    (guild) => guild.name.toLowerCase().includes(value.toLowerCase()) || guild.id === value,
  );

  if (!filteredGuilds.length)
    return (
      <div className='flex flex-col items-center gap-3'>
        <Icon icon='solar:clipboard-remove-bold' className='text-content3 text-[128px]' />
        <p className='text-center '>
          <span className='inline-block'>条件に一致するサーバーが</span>
          <span className='inline-block'>見つかりませんでした</span>
        </p>
      </div>
    );

  return (
    <div className='grid grid-cols-12 gap-6'>
      {filteredGuilds.map((guild) => (
        <GuildCard key={guild.id} guild={guild} />
      ))}
    </div>
  );
}
