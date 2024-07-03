declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * このWebアプリケーションのURL
     */
    readonly BASE_URL: string;

    /**
     * データベースの接続URL
     */
    readonly DATABASE_URL: string;

    /**
     * データベースのコレクション名
     */
    readonly DATABASE_NAME: string;

    /**
     * セッションに使用するシークレットキー
     */
    readonly SESSION_SECRET: string;

    /**
     * DiscordBotのクライアントID
     */
    readonly DISCORD_ID: string;

    /**
     * DiscordBotの招待リンクに追加する権限
     */
    readonly DISCORD_PERMISSION: string;

    /**
     * DiscordOauth2のクライアントシークレット
     */
    readonly DISCORD_SECRET: string;

    /**
     * DiscordBotのトークン
     */
    readonly DISCORD_TOKEN: string;
  }
}
