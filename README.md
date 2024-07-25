# NoNICK.js Dashboard

> [!WARNING]
> `🚧` このプロジェクトは現在開発中であり、本番環境で動作させる準備が整っていません。

![preview](/.github/assets/preview.png)

[Remix](https://remix.run)で構築された、NoNICK.jsの設定を行えるWebダッシュボード

## 📑Usage
### Discordアプリケーションを作成する
まず、[Discord開発者ポータル](https://discord.com/developers/applications)でWebダッシュボードに使うDiscordアプリケーションを作成する必要があります。アプリケーションを作成したら、「OAuth2」タブにアクセスし、`Redirects`に以下のURLを追加してください。

* `http://localhost:5173/auth/callback`
* `http://localhost:5173/invite/callback`

### 環境変数を設定する
ルートディレクトリに`.env`ファイルを作成し、環境変数を設定します。

|変数名|説明|
|---|---|
|`BASE_URL`|ダッシュボードのベースURL|
|`DATABASE_URL`|MongoDBの接続に使用するURL|
|`DATABASE_NAME`|MongoDBのコレクション名|
|`SESSION_SECRET`|セッションに使用するシークレットキー|
|`DISCORD_ID`|DiscordBotのクライアントID|
|`DISCORD_SECRET`|DiscordOauth2のクライアントシークレット|
|`DISCORD_PERMISSION`|DiscordBotの招待リンクに追加する権限|
|`DISCORD_TOKEN`|DiscordBotのトークン|

以下のコマンドで`SESSION_SECRET`の値を作成できます。
```sh
openssl rand -base64 32
```

設定が終わったら、以下のコマンドを使用して開発サーバーを起動します。

```sh
pnpm dev
```
