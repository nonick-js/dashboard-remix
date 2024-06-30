declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * このWebアプリケーションのURL
     */
    readonly BASE_URL: string;

    /**
     * セッションに使用するシークレットキー
     */
    readonly SESSION_SECRET: string;

    /**
     * Discord Oauth2に使用するクライアントID
     */
    readonly DISCORD_ID: string;

    /**
     * Discord Oauth2に使用するクライアントシークレット
     */
    readonly DISCORD_SECRET: string;
  }
}
