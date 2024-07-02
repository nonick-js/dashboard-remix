export type DashboardConfigType = {
  sidebar: {
    label?: string;
    key: string;
    items: {
      label: string;
      icon: string;
      key: string;
      chipLabel?: string;
    }[];
  }[];
};
