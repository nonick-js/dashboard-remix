import type { DashboardConfigType } from '~/types/config';

const DashboardConfig: DashboardConfigType = {
  sidebar: [
    {
      key: 'home',
      items: [
        {
          label: 'ダッシュボード',
          icon: 'solar:widget-5-bold',
          key: '',
        },
        {
          label: '監査ログ',
          icon: 'solar:list-check-bold',
          key: 'audit-log',
        },
      ],
    },
    {
      label: '機能',
      key: 'features',
      items: [
        {
          label: '入室メッセージ',
          icon: 'solar:users-group-rounded-bold',
          key: 'join-message',
        },
        {
          label: '退室メッセージ',
          icon: 'solar:users-group-rounded-bold',
          key: 'leave-message',
        },
        {
          label: 'サーバー内通報',
          icon: 'solar:flag-bold',
          key: 'report',
        },
        {
          label: 'イベントログ',
          icon: 'solar:clipboard-list-bold',
          key: 'event-log',
        },
        {
          label: 'メッセージURL展開',
          icon: 'solar:link-round-bold',
          key: 'message-expand',
        },
        {
          label: '自動認証レベル変更',
          icon: 'solar:shield-check-bold',
          key: 'auto-change-verification-level',
        },
        {
          label: '自動アナウンス公開',
          icon: 'solar:mailbox-bold',
          key: 'auto-public',
        },
        {
          label: '自動スレッド作成',
          icon: 'solar:hashtag-chat-bold',
          key: 'auto-create-thread',
          chipLabel: 'New',
        },
        {
          label: 'AutoMod Plus',
          icon: 'solar:sledgehammer-bold',
          key: 'automod-plus',
        },
      ],
    },
  ],
};

export default DashboardConfig;
