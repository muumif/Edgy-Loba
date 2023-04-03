//This file is a mess a should be reworked
import axios from "axios";
import { Snowflake } from "discord.js";
import { filename } from "./const";
import { logger } from "./logger";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONBigInt = require("json-bigint")({ "storeAsString": true });

export async function IGNToUID(IGN: string, platform: "PC" | "X1" | "PS4", guildId: Snowflake | undefined, discordId: Snowflake) {
      try {
            const response = await makeRequest(`${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`);
            if (response.data.includes("Error")) {
                  throw `0101: ${response.data}`;
            }

            if (platform != "PC") {
                  if (JSONBigInt.parse(response.data).result == undefined) {
                        throw "0101: Unknown user! Please use Origin username! If you are on console please report this as a bug.";
                  }
                  logger.info("Fetched a console users UID!", { metadata: { serverId: guildId, discordId: discordId, IGN: IGN, platform: platform, file: filename(__filename) } });
                  return JSONBigInt.parse(response.data).result;
            }

            logger.info("Fetched a pc users UID!", { metadata: { serverId: guildId, discordId: discordId, IGN: IGN, platform: platform, file: filename(__filename) } });
            return JSONBigInt.parse(response.data).uid;

      }
      catch (error: any) {
            if (error.includes("0101")) {
                  logger.error(error, { metadata: { file: filename(__filename), serverId: guildId, discordId: discordId, IGN: IGN, platform: platform } });
                  return Promise.reject(`0101: ${error}`);
            }
            else {
                  logger.error(error, { metadata: { file: filename(__filename), serverId: guildId, discordId: discordId, IGN: IGN, platform: platform } });
                  return Promise.reject(error);
            }
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
                  logger.error(error.response, { metadata: { file: filename(__filename), serverId: guildId, discordId: discordId, platform: platform } });
                  return Promise.reject(error.response);
            }
            if (error) {
                  logger.error(error.response, { metadata: { file: filename(__filename), serverId: guildId, discordId: discordId, platform: platform } });
                  return Promise.reject(error);
            }
      }
}

async function makeRequest(URL: string) {
      try {
            const data = await axios.get(encodeURI(URL), { transformResponse: [data => data] });
            return data;
      }
      catch (error: any) {
            return Promise.reject(error);
      }
}
