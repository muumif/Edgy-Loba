export {};

declare global {
      namespace NodeJS {
            interface ProcessEnv {
                  NODE_ENV: "development" | "production";
                  DISCORD_TOKEN: string;
                  ALS_TOKEN: string;
                  ALS_ENDPOINT: URL;
                  MONGO_CONNECTION: string;
                  BITLY_TOKEN: string;
                  BITLY_ENDPOINT: URL;
                  TOPGG_TOKEN: string;
                  npm_package_version: string;
                  REDIS_CONNECTION: string;
            }
      }
}