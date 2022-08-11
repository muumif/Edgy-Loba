import { Guild, Snowflake } from "discord.js";
import { MongoClient } from "mongodb";
import { HistoryDocument, UserDocument } from "../types/mongo";
import { filename } from "./const";
import { logger } from "./logger";

const server = `mongodb://${process.env.MONGO_CONNECTION}/?authMechanism=DEFAULT`;
const DBClient = new MongoClient(server);

let usersCollection = DBClient.db("EdgyLoba").collection("users");
let historyCollection = DBClient.db("EdgyLoba").collection("userHistory");
let guildCollection = DBClient.db("EdgyLoba").collection("guilds");

if (process.env.NODE_ENV == "development") {
      usersCollection = DBClient.db("EdgyLobaDEV").collection("users");
      historyCollection = DBClient.db("EdgyLobaDEV").collection("userHistory");
      guildCollection = DBClient.db("EdgyLobaDEV").collection("guilds");
}

//TODO: Logging for calls
export class User {
      discordId: Snowflake;

      constructor(discordId: Snowflake) {
            this.discordId = discordId;
      }

      public async getUser() {
            try {
                  await DBClient.connect();

                  const user = await usersCollection.findOne({ discordId: this.discordId.toString() }) as UserDocument | null;

                  if (user == null) return Promise.resolve("User not found!");

                  logger.info("Fetched a user from the DB!", { discordId: this.discordId, file: filename(__filename) });
                  return Promise.resolve(user);
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async getHistory() {
            try {
                  await DBClient.connect();

                  const history = await historyCollection.find({ discordId: this.discordId.toString() }).sort({ date: 1 }).toArray() as HistoryDocument[] | [];

                  if (history.length == 0) return Promise.reject("No history data was found!");

                  logger.info("Fetched history from the DB!", { discordId: this.discordId, file: filename(__filename) });
                  return Promise.resolve(history);
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async addUser(originId: string, RP: number, AP: number, platform: string, serverId: Snowflake | undefined) {
            try {
                  await DBClient.connect();
                  const id = this.discordId;
                  return await usersCollection.insertOne({
                        discordId: this.discordId,
                        originId: originId,
                        RP: RP,
                        AP: AP,
                        platform: platform,
                        servers: [serverId],
                  })
                        .then(function() {
                              logger.info("Added a user to the DB!", { serverId: serverId, discordId: id, file: filename(__filename) });
                              return Promise.resolve("User data inserted");
                        });
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async addHistory(RP: number, AP: number) {
            try {
                  await DBClient.connect();
                  const id = this.discordId;
                  return await historyCollection.insertOne({
                        discordId: this.discordId,
                        date: new Date(),
                        RP: RP,
                        AP: AP,
                  })
                        .then(function() {
                              logger.info("Added history data to the DB!", { discordId: id, file: filename(__filename) });
                              return Promise.resolve("History data inserted");
                        });
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async addServer(serverId: Snowflake) {
            try {
                  await DBClient.connect();
                  const id = this.discordId;
                  return await usersCollection.updateOne({ discordId: this.discordId }, { $push: { servers: serverId } })
                        .then(function() {
                              logger.info("Updated a users servers in the DB!", { serverId: serverId, discordId: id, file: filename(__filename) });
                              return Promise.resolve("Server data inserted");
                        });

            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async updateRP(RP: number) {
            try {
                  await DBClient.connect();
                  const id = this.discordId;
                  return await usersCollection.updateOne({ discordId: this.discordId }, { $set:{ RP: RP } })
                        .then(function() {
                              logger.info("Updated a users RP in the DB!", { discordId: id, file: filename(__filename) });
                              return Promise.resolve("Updated RP");
                        });
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async updateAP(AP: number) {
            try {
                  await DBClient.connect();
                  const id = this.discordId;
                  return await usersCollection.updateOne({ discordId: this.discordId }, { $set:{ AP: AP } })
                        .then(function() {
                              logger.info("Updated a users RP in the DB!", { discordId: id, file: filename(__filename) });
                              return Promise.resolve("Updated AP");
                        });
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async deleteUser() {
            try {
                  await DBClient.connect();
                  const id = this.discordId;
                  return await usersCollection.deleteOne({ discordId: this.discordId })
                        .then(function() {
                              logger.info("Deleted a user from the DB!", { discordId: id, file: filename(__filename) });
                              return Promise.resolve("Deleted user");
                        });
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }
}

export class Server {
      guild: Guild;
      constructor(guild: Guild) {
            this.guild = guild;
      }

      public async addServer() {
            try {
                  await DBClient.connect();
                  const id = this.guild.id;
                  return await guildCollection.insertOne({
                        serverId: this.guild.id,
                        name: this.guild.name,
                  })
                        .then(function() {
                              logger.info("Added a server to the DB!", { serverId: id, file: filename(__filename) });
                              return Promise.resolve("Inserted server");
                        });

            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async deleteServer() {
            try {
                  await DBClient.connect();

                  logger.info("Deleted a server from the DB!", { serverId: this.guild.id, file: filename(__filename) });
                  return await guildCollection.deleteOne({ serverId: this.guild.id });
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }
}