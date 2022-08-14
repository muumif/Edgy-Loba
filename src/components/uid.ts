import axios from "axios";
import { Snowflake } from "discord.js";
import { filename } from "./const";
import { logger } from "./logger";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONBigInt = require("json-bigint")({ "storeAsString": true });

export async function getUserUID(IGN: string, platform: "PC" | "X1" | "PS4", guildId: Snowflake | undefined, discordId: Snowflake) {
      try {
            const response = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`), { transformResponse: [data => data] });
            if (response.data.includes("Error")) { // This is used to check for Errors instead of catch. Could throw an error then handle it in catch.
                  logger.error(response.data, { guildId: guildId, discordId: discordId, IGN: IGN, platform: platform, file: filename(__filename) });
                  if (response.data.includes("Slow down !")) {
                        return Promise.reject({ isGetUidError: true, message: "Try again in a few seconds!" });
                  }
                  return Promise.reject({ isGetUidError: true, message: response.data });
            }
            if (platform == "PC") { // PC players have to be separated because the data that is returned is different for them
                  if (JSONBigInt.parse(response.data).uid == undefined) { // This is to check if an user was returned or not. Because the API doesn't throw an Error if no user exists.
                        logger.error(response.data, { guildId: guildId, discordId: discordId, IGN: IGN, platform: platform, file: filename(__filename) });
                        return Promise.reject({ isGetUidError: true, message: "Error: Unknown user! Please use Origin username!" });
                  }
                  logger.info("Fetched a users UID!", { guildId: guildId, discordId: discordId, IGN: IGN, platform: platform, file: filename(__filename) });
                  return JSONBigInt.parse(response.data).uid;
            }
            logger.info("Fetched a users UID!", { guildId: guildId, discordId: discordId, IGN: IGN, platform: platform, file: filename(__filename) });
            return JSONBigInt.parse(response.data).result;
      }
      catch (error) {
            // Can't use catch because the API doesn't throw any Errors even if there is one.
      }

}

export async function UIDToIGN(UID: string, platform: "PC" | "X1" | "PS4", guildId: Snowflake, discordId: Snowflake) {
      try {
            const data = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}&skipRank=true`));
            logger.info("ALS API fetched user!", { guildId: guildId, discordId: discordId, UID: UID, platform: platform, file: filename(__filename) });
            return data.data.global.name;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (error: any) {
            if (error.response) {
                  logger.error(error, { guildId: guildId, discordId: discordId, UID: UID, platform: platform, file: filename(__filename) });
            }
            if (error) {
                  logger.error(error, { guildId: guildId, discordId: discordId, UID: UID, platform: platform, file: filename(__filename) });
            }
      }
}
