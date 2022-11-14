import { MongoClient } from "mongodb";
import { ServerDocument, UserDocument } from "../types/mongo";
import { client } from "../index";
import { logger } from "./logger";
import { filename } from "./const";
import axios from "axios";
import { ALSUserData } from "../types/als";
import { DBServer, DBUser } from "./mongo";
import { Guild, User } from "discord.js";

const server = `${process.env.MONGO_CONNECTION}/?authSource=admin`;
const DBClient = new MongoClient(server);

let guildCollection = DBClient.db("EdgyLoba").collection("guilds");
let usersCollection = DBClient.db("EdgyLoba").collection("users");
if (process.env.NODE_ENV == "development") {
      guildCollection = DBClient.db("EdgyLobaDEV").collection("guilds");
      usersCollection = DBClient.db("EdgyLobaDEV").collection("users");
}

export async function updateMemberCount() {
      try {
            await DBClient.connect();

            const guilds = await guildCollection.find().toArray() as ServerDocument[] | [];
            const updatedServers = [];
            for (let i = 0; i < guilds.length; i++) {
                  const guild = await client.guilds.cache.get(guilds[i].serverId) as Guild;
                  const memberCount = await new DBServer(guild).memberCount();
                  await guildCollection.updateOne({ serverId: guilds[i].serverId }, { $set: { memberCount: memberCount } });
                  updatedServers.push({ name: guilds[i].name, id: guilds[i].id });
                  logger.info(`Updated servers [${guilds[i].name}] member count!`, { metadata: { file: filename(__filename), serverId: guilds[i].serverId } });
            }
            return Promise.resolve(updatedServers);
      }
      catch (error: any) {
            logger.error(error, { metadata: { file: filename(__filename) } });
            return Promise.reject(error);
      }
      finally {
            await DBClient.close();
      }
}

export async function updateUserNames() {
      try {
            await DBClient.connect();

            const users = await usersCollection.find().toArray() as UserDocument[] | [];
            const updatedUsers = [];
            for (let i = 0; i < users.length; i++) {
                  const ALSUser = (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${users[i].originId}&platform=${users[i].platform}&merge=true&removeMerged=true`))).data as ALSUserData;
                  const apexName = ALSUser.global.name;
                  const discordUser = (await client.users.fetch(users[i].discordId)) as User;
                  await new DBUser(discordUser).updateNames(apexName);
                  updatedUsers.push({ id: users[i].discordId });
            }
            return Promise.resolve(updatedUsers);
      }
      catch (error: any) {
            logger.error(error, { metadata: { file: filename(__filename) } });
            return Promise.reject(error);
      }
      finally {
            await DBClient.close();
      }
}