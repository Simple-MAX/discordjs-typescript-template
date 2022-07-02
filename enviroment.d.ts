declare namespace NodeJS {
  export interface ProcessEnv {
    readonly NODE_ENV: "development" | "production" | "test";
    readonly CLIENT_ID: string;
    readonly GUILD_ID: string;
    readonly TOKEN: string;
  }
}
