export type DashboardConfigType = {
  navigation: {
    items: NavigationItemConfig[];
    sections: {
      label: string;
      key: string;
      items: NavigationItemConfig[];
    }[];
  };
};

export type NavigationItemConfig = {
  /** 表示名 */
  label: string;
  /** iconify-iconのアイコン名 */
  icon: string;
  /** パスに使用する一意の文字列 */
  path: string;
  /** Chipコンポーネントに表示する文字列 */
  chipLabel?: string;
};
