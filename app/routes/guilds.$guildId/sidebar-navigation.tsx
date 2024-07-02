import { useParams } from '@remix-run/react';
import { NavigationItem, NavigationList, NavigationSection } from '~/components/ui/navigation-list';
import DashboardConfig from '~/config/dashboard';

export function SidebarNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const { guildId } = useParams();

  return (
    <NavigationList onNavigate={onNavigate}>
      {DashboardConfig.sidebar.map(({ label, items, key }, index) => (
        <NavigationSection
          label={label}
          key={key}
          showDivider={index !== DashboardConfig.sidebar.length - 1}
        >
          {items.map(({ key, label, chipLabel, icon }, index) => (
            <NavigationItem
              key={key}
              to={`/guilds/${guildId}/${key}`}
              icon={icon}
              chipLabel={chipLabel}
              label={label}
            />
          ))}
        </NavigationSection>
      ))}
    </NavigationList>
  );
}
