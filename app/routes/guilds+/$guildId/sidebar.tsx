import { Icon } from '@iconify-icon/react/dist/iconify.mjs';
import {
  Accordion,
  AccordionItem,
  Chip,
  Listbox,
  ListboxItem,
  ScrollShadow,
  type ScrollShadowProps,
  cn,
} from '@nextui-org/react';
import { Link, useLoaderData, useLocation, useNavigate, useParams } from '@remix-run/react';
import { createContext, useContext } from 'react';
import { Logo } from '~/components/logo';
import { GuildSelect } from '~/components/selects/guild-select';
import DashboardConfig from '~/config/dashboard';
import type { NavigationItemConfig } from '~/types/config';
import type { loader } from './route';

const NavigationEventContext = createContext<(() => void) | undefined>(() => {});

/** ダッシュボード用サイドバー */
export function Sidebar({
  className,
  onNavigate,
  ...props
}: ScrollShadowProps & { onNavigate?: () => void }) {
  return (
    <NavigationEventContext.Provider value={onNavigate}>
      <ScrollShadow
        className={cn('w-[280px] h-dvh', className)}
        hideScrollBar
        isEnabled={false}
        {...props}
      >
        <div className='h-20 flex items-center justify-start'>
          <Link to='/'>
            <Logo height={18} />
          </Link>
        </div>
        <div className='flex flex-col gap-3'>
          <SidebarGuildSelect />
          <SidebarNavigation />
        </div>
      </ScrollShadow>
    </NavigationEventContext.Provider>
  );
}

/**
 * サーバー選択セレクトメニュー
 * （サーバーを選択するとそのサーバーのダッシュボードページに移動）
 */
function SidebarGuildSelect() {
  const { guilds } = useLoaderData<typeof loader>();
  const onNavigate = useContext(NavigationEventContext);
  const { guildId } = useParams();
  const navigate = useNavigate();

  return (
    <GuildSelect
      classNames={{ trigger: 'h-14' }}
      onChange={(e) => {
        onNavigate?.();
        navigate(`/guilds/${e.target.value}`);
      }}
      guilds={guilds || []}
      defaultSelectedKeys={guildId ? [guildId] : []}
      aria-label='サーバー選択'
      disallowEmptySelection
    />
  );
}

/** サイドバー用ナビゲーションメニュー */
function SidebarNavigation() {
  const NavigationConfig = DashboardConfig.navigation;

  return (
    <div className='flex flex-col pb-3'>
      <SidebarNavigationListBox items={NavigationConfig.items} key='non-category' />
      {NavigationConfig.sections && (
        <Accordion
          className='px-0'
          selectionMode='multiple'
          defaultSelectedKeys={NavigationConfig.sections.map((section) => section.key)}
          showDivider={false}
        >
          {NavigationConfig.sections?.map((section) => (
            <AccordionItem
              classNames={{
                heading: 'px-1',
                trigger: 'py-3 px-0 rounded-md',
                title: 'text-sm text-default-500 font-bold',
                content: 'p-0',
              }}
              title={section.label}
              aria-label={section.label}
              key={section.key}
              textValue={section.key}
            >
              <SidebarNavigationListBox key={section.key} items={section.items} />
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

function SidebarNavigationListBox({ items }: { items: NavigationItemConfig[] }) {
  const { guildId } = useParams();
  const location = useLocation();
  const onNavigate = useContext(NavigationEventContext);

  return (
    <Listbox classNames={{ base: 'p-1' }} aria-label='ナビゲーションメニュー'>
      {items.map((item) => {
        const href = `/guilds/${guildId}/${item.path}`;
        const isSamePath = location.pathname === href || `${location.pathname}/` === href;

        return (
          <ListboxItem
            onClick={onNavigate}
            classNames={{
              base: cn('px-3 py-0 h-[40px] data-[hover=true]:bg-default-300/40 gap-3', {
                'bg-default-300/40': isSamePath,
              }),
            }}
            href={isSamePath ? undefined : href}
            key={item.path}
            aria-label={item.label}
            textValue={item.path}
            startContent={<Icon icon={item.icon} className='text-[22px]' />}
            endContent={item.chipLabel && <Chip size='sm'>{item.chipLabel}</Chip>}
          >
            {item.label}
          </ListboxItem>
        );
      })}
    </Listbox>
  );
}
