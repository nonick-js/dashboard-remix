import { useNavigate, useParams } from '@remix-run/react';
import { useContext } from 'react';
import { GuildSelect } from '~/components/guild-select';
import { ManagedMutualGuildsContext } from './contexts';

export function SidebarGuildSelect() {
  const guilds = useContext(ManagedMutualGuildsContext);
  const navigate = useNavigate();
  const { guildId } = useParams();

  return (
    <GuildSelect
      classNames={{ trigger: 'h-16' }}
      onChange={(e) => navigate(`/guilds/${e.target.value}`)}
      guilds={guilds}
      defaultSelectedKeys={guildId ? [guildId] : []}
      aria-label='サーバー選択'
      disallowEmptySelection
    />
  );
}
