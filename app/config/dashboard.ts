import type { DashboardConfigType } from '~/types/config';

const DashboardConfig: DashboardConfigType = {
  navigation: {
    items: [
      {
        label: 'ダッシュボード',
        icon: 'solar:widget-5-bold',
        path: '',
      },
      {
        label: '監査ログ',
        icon: 'solar:calendar-search-bold',
        path: 'audit-log',
      },
    ],
    sections: [
      {
        label: '機能',
        key: 'features',
        items: [
          {
            label: '入室メッセージ',
            icon: 'solar:users-group-rounded-bold',
            path: 'join-message',
          },
          {
            label: '退室メッセージ',
            icon: 'solar:users-group-rounded-bold',
            path: 'leave-message',
          },
          {
            label: 'サーバー内通報',
            icon: 'solar:flag-bold',
            path: 'report',
          },
          {
            label: 'イベントログ',
            icon: 'solar:clipboard-list-bold',
            path: 'event-log',
          },
          {
            label: 'メッセージURL展開',
            icon: 'solar:link-round-bold',
            path: 'message-expand',
          },
          {
            label: '自動認証レベル変更',
            icon: 'solar:shield-check-bold',
            path: 'auto-change-verification-level',
          },
          {
            label: '自動アナウンス公開',
            icon: 'solar:mailbox-bold',
            path: 'auto-public',
          },
          {
            label: '自動スレッド作成',
            icon: 'solar:hashtag-chat-bold',
            path: 'auto-create-thread',
            chipLabel: 'New',
          },
          {
            label: 'AutoMod Plus',
            icon: 'solar:sledgehammer-bold',
            path: 'automod-plus',
          },
        ],
      },
    ],
  },
};

export default DashboardConfig;
