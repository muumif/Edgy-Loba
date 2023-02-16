//This file is a mess a should be reworked
import axios from "axios";
import { Snowflake } from "discord.js";
import { filename } from "./const";
import { logger } from "./logger";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONBigInt = require("json-bigint")({ "storeAsString": true });

export async function IGNToUID(IGN: string, platform: "PC" | "X1" | "PS4", guildId: Snowflake | undefined, discordId: Snowflake) {
      try {
            let response = await makeRequest(`${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`);

            if (response.data.includes("Error")) {
                  if (response.data.includes("Slow down!")) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        response = await makeRequest(`${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`);
                  }
                  else {
                        throw new Error(response.data);
                  }
            }

            if (platform != "PC") {
                  logger.info("Fetched a users UID!", { metadata: { serverId: guildId, discordId: discordId, IGN: IGN, platform: platform, file: filename(__filename) } });
                  return JSONBigInt.parse(response.data).result;
            }

            logger.info("Fetched a users UID!", { metadata: { serverId: guildId, discordId: discordId, IGN: IGN, platform: platform, file: filename(__filename) } });
            return JSONBigInt.parse(response.data).uid;

      }
      catch (error: any) {
            logger.error(error, { metadata: { serverId: guildId, discordId: discordId, IGN: IGN, platform: platform, file: filename(__filename) } });
            return Promise.reject(error);
      }

}

export async function UIDToIGN(UID: string, platform: "PC" | "X1" | "PS4", guildId: Snowflake, discordId: Snowflake) {
      try {
            const data = await makeRequest(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}&skipRank=true`);
            logger.info("ALS API fetched user!", { metadata:{ serverId: guildId, discordId: discordId, UID: UID, platform: platform, file: filename(__filename) } });
            return data.data.global.name;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (error: any) {
            if (error.response) {
                  logger.error(error, { metadata:{ serverId: guildId, discordId: discordId, UID: UID, platform: platform, file: filename(__filename) } });
            }
            if (error) {
                  logger.error(error, { metadata:{ serverId: guildId, discordId: discordId, UID: UID, platform: platform, file: filename(__filename) } });
            }
      }
}

async function makeRequest(URL: string) {
      const data = await axios.get(encodeURI(URL), { transformResponse: [data => data] });
      return data;
}
