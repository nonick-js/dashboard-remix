'use client';

import { Avatar } from '@nextui-org/avatar';
import { Chip } from '@nextui-org/chip';
import { Select, SelectItem, type SelectProps, type SelectedItems } from '@nextui-org/react';
import type { APIGuild, RESTAPIPartialCurrentUserGuild } from 'discord-api-types/v10';
import React from 'react';
import { Discord } from '~/libs/constants';

export type GuildSelectProps = {
  guilds: (APIGuild | RESTAPIPartialCurrentUserGuild)[];
} & Omit<SelectProps, 'items' | 'children' | 'isMultiline'>;

const GuildSelect = React.forwardRef<HTMLSelectElement, GuildSelectProps>(
  (
    {
      guilds,
      selectionMode = 'single',
      variant = 'bordered',
      placeholder = 'サーバーを選択',
      ...props
    },
    ref,
  ) => {
    function renderValue(items: SelectedItems<APIGuild | RESTAPIPartialCurrentUserGuild>) {
      return (
        <div className='flex flex-wrap items-center gap-1'>
          {items.map((item) => {
            if (!item.data) return null;

            return selectionMode === 'multiple' ? (
              <MultipleSelectItem guild={item.data} key={item.key} />
            ) : (
              <SingleSelectItem guild={item.data} key={item.key} />
            );
          })}
        </div>
      );
    }

    return (
      <Select
        ref={ref}
        items={guilds}
        variant={variant}
        placeholder={placeholder}
        renderValue={renderValue}
        selectionMode={selectionMode}
        isMultiline={selectionMode === 'multiple'}
        {...props}
      >
        {(guild) => (
          <SelectItem key={guild.id} value={guild.id} textValue={guild.name}>
            <SingleSelectItem guild={guild} />
          </SelectItem>
        )}
      </Select>
    );
  },
);

GuildSelect.displayName = 'GuildSelect';

function SingleSelectItem({ guild }: { guild: APIGuild | RESTAPIPartialCurrentUserGuild }) {
  return (
    <div className='flex items-center gap-3 text-foreground'>
      <Avatar
        size='sm'
        name={guild.name}
        src={
          guild.icon ? `${Discord.Endpoints.CDN}/icons/${guild.id}/${guild.icon}.webp` : undefined
        }
        showFallback
      />
      <p className='flex-1 whitespace-nowrap font-semibold truncate'>{guild.name}</p>
    </div>
  );
}

function MultipleSelectItem({ guild }: { guild: APIGuild | RESTAPIPartialCurrentUserGuild }) {
  return (
    <Chip
      avatar={
        <Avatar
          name={guild.name}
          size='md'
          src={
            guild.icon ? `${Discord.Endpoints.CDN}/icons/${guild.id}/${guild.icon}.webp` : undefined
          }
          showFallback
        />
      }
    >
      {guild.name}
    </Chip>
  );
}

export { GuildSelect };
