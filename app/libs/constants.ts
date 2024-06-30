export namespace Discord {
  export enum Endpoints {
    API = 'https://discord.com/api/v10',
    CDN = 'https://cdn.discordapp.com',
  }

  export enum Permissions {
    Administrator = 1 << 3,
    ManageGuild = 1 << 5,
  }
}
