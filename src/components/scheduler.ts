import axios from "axios";
import schedule from "node-schedule";
import { readdir, unlink } from "fs";
import { cwd } from "process";
import { ALSUserData } from "../types/als";
import { UserDocument } from "../types/mongo";
import { filename } from "./const";
import { DBGlobal, DBUser } from "./database";
import { logger } from "./logger";

async function HistoryUpdater() {
      try {
            let users = await new DBGlobal().getAllUsers() as UserDocument[] | string;
            if (users == "No user data!") return logger.error("No users in the DB", { file: filename(__filename) });
            users = users as UserDocument[];
            for (let i = 0; i < users.length; i++) {
                  const user = (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${users[i].originId}&platform=${users[i].platform}`))).data as ALSUserData;
                  await new DBUser(users[i].discordId).addHistory(user.global.rank.rankScore, user.global.arena.rankScore);
            }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (error:any) {
            if (error.response) {
                  return logger.error(error, { file: filename(__filename) });
            }
            if (error) {
                  return logger.error(error, { file: filename(__filename) });
            }
      }
}

async function deleteTemp() {
      try {
            readdir(`${cwd()}/temp`, (err, data) => {
                  if (err) throw err;
                  data.forEach(file => {
                        unlink(`${cwd()}/temp/${file}`, err => {
                              if (err) throw err;
                              logger.info(`Deleted file: ${file} in temp!`, { file: filename(__filename) });
                        });
                  });
            });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      catch (error:any) {
            return logger.error(error, { file: filename(__filename) });
      }
}

export const cronHistoryUpdate = schedule.scheduleJob("55 23 * * *", async function() {
      logger.info("▬▬ι═══════ﺤ History updating started -═══════ι▬▬", { file: filename(__filename) }),
      await HistoryUpdater();
      logger.info("▬▬ι═══════ﺤ History updating stopped -═══════ι▬▬", { file: filename(__filename) });
});

export const cronDeleteTemp = schedule.scheduleJob("0 */12 * * *", async function() {
      deleteTemp();
});