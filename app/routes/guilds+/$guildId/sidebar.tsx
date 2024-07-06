import { ScrollShadow } from '@nextui-org/react';
import { SidebarGuildSelect } from './sidebar-guild-select';
import { SidebarNavigation } from './sidebar-navigation';

export function Sidebar() {
  return (
    <ScrollShadow
      // 画面上でサイドバーを固定し、フォームのスクロールに合わせて移動しないようにする
      className='sticky top-[64px] flex flex-col gap-4 w-[280px] h-[calc(100dvh_-_80px)] max-lg:hidden'
      hideScrollBar
    >
      <SidebarGuildSelect />
      <SidebarNavigation />
    </ScrollShadow>
  );
}
