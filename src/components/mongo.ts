import { Client, Guild, Snowflake, User } from "discord.js";
import { MongoClient } from "mongodb";
import { HistoryDocument, UserDocument, ServerDocument } from "../types/mongo";
import { filename } from "./const";
import { logger } from "./logger";

const server = `${process.env.MONGO_CONNECTION}/?authSource=admin`;
const DBClient = new MongoClient(server);

let usersCollection = DBClient.db("EdgyLoba").collection("users");
let historyCollection = DBClient.db("EdgyLoba").collection("userHistory");
let guildCollection = DBClient.db("EdgyLoba").collection("guilds");
let bugCollection = DBClient.db("EdgyLoba").collection("bugs");
let logsCollection = DBClient.db("EdgyLoba").collection("logs");

if (process.env.NODE_ENV == "development") {
      usersCollection = DBClient.db("EdgyLobaDEV").collection("users");
      historyCollection = DBClient.db("EdgyLobaDEV").collection("userHistory");
      guildCollection = DBClient.db("EdgyLobaDEV").collection("guilds");
      bugCollection = DBClient.db("EdgyLobaDEV").collection("bugs");
      logsCollection = DBClient.db("EdgyLobaDEV").collection("logs");
}

export class DBGlobal {
      userAverageRP = async () => {
            type RP = {
                  RP: number
            };
            try {
                  const dateBefore = new Date().getTime();
                  await DBClient.connect();

                  const users = await usersCollection.find({}).project({ "RP": 1, "_id": 0 }).toArray() as RP[];

                  if (users.length == 0) return Promise.resolve("No user data!");

                  const totalRP = () => {
                        let total = 0;
                        for (let i = 0; i < users.length; i++) {
                              total = total + users[i].RP;
                        }
                        return total;
                  };

                  const dateAfter = new Date().getTime();
                  logger.info("Fetched average RP from the DB!", { metadata: { file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return Math.floor(totalRP() / users.length);
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      };

      statistics = async () => {
            try {
                  const dateBefore = new Date().getTime();
                  await DBClient.connect();
                  const userCount = await usersCollection.countDocuments();
                  const serverCount = await guildCollection.countDocuments();
                  const historyCount = await historyCollection.countDocuments();
                  const logCount = await logsCollection.countDocuments();

                  const dateAfter = new Date().getTime();
                  logger.info("Statistics fetched!", { metadata: { file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return {
                        userCount: userCount,
                        serverCount: serverCount,
                        historyCount: historyCount,
                        logCount: logCount,
                  };
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      };
      public async getAllUsers() {
            try {
                  const dateBefore = new Date().getTime();
                  await DBClient.connect();

                  const users = await usersCollection.find().toArray();

                  if (users == null) return Promise.resolve("No user data!");
                  const dateAfter = new Date().getTime();
                  logger.info("Fetched all users from the DB!", { metadata: { file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return Promise.resolve(users);
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async getGlobalTopUsers(guild: Guild) {
            try {
                  const dateBefore = new Date().getTime();
                  await DBClient.connect();
                  const users = await usersCollection.find().sort({ RP: -1 }).limit(3).toArray();

                  if (users.length == 0) return Promise.resolve("No user data!");
                  const dateAfter = new Date().getTime();
                  logger.info("Fetched users from the DB!", { metadata: { serverId: guild.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return Promise.resolve(users);
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async addBug(discordId: Snowflake, serverId: Snowflake, command: string, message: string) {
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();

                  return await bugCollection.insertOne({
                        serverId: serverId,
                        discordId: discordId,
                        date: new Date(),
                        data: {
                              command: command,
                              message: message,
                        },
                  })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Added a bug into the DB!", { metadata: { serverId: serverId, discordId: discordId, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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

      public async verifyServers(client: Client) {
            try {

                  const addGuilds = async () => {
                        const guilds = client.guilds.cache.map(guild => guild);
                        for (let i = 0; i < guilds.length; i++) {
                              const DBGuild = await guildCollection.findOne({ serverId: guilds[i].id }) as ServerDocument | null;
                              if (DBGuild == null) {
                                    await guildCollection.insertOne({
                                          serverId: guilds[i].id,
                                          name: guilds[i].name,
                                    }) .then(function() {
                                          logger.info("Added a server to the DB!", { metadata: { serverId: guilds[i].id, file: filename(__filename) } });
                                    });
                              }
                        }
                        return;
                  };

                  const deleteGuilds = async () => {
                        const DBGuilds = await guildCollection.find({}).toArray() as ServerDocument[] | [];
                        for (let i = 0; i < DBGuilds.length; i++) {
                              if (client.guilds.cache.get(DBGuilds[i].serverId) == undefined) {
                                    await guildCollection.deleteOne({ serverId: DBGuilds[i].serverId });
                                    logger.info("Deleted a server from the DB!", { metadata: { serverId: DBGuilds[i].serverId, file: filename(__filename) } });
                              }
                        }
                        return;
                  };
                  await DBClient.connect();
                  await addGuilds();
                  await deleteGuilds();
                  return;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error:any) {
                  return logger.error(error, { metadata: { file: filename(__filename) } });
            }
            finally {
                  await DBClient.close();
            }
      }
}

export class DBUser {
      discordUser: User;

      constructor(discordUser: User) {
            this.discordUser = discordUser;
      }

      public async getUser() {
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();

                  const user = await usersCollection.findOne({ discordId: this.discordUser.id.toString() }) as UserDocument | null;

                  if (user == null) return Promise.resolve("User not found!");

                  const dateAfter = new Date().getTime();
                  logger.info("Fetched a user from the DB!", { metadata: { discordId: this.discordUser.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();

                  const history = await historyCollection.find({ discordId: this.discordUser.id.toString() }).sort({ date: 1 }).toArray() as HistoryDocument[] | [];

                  if (history.length == 0) return Promise.resolve("No history data was found!");

                  const dateAfter = new Date().getTime();
                  logger.info("Fetched a users history from the DB!", { metadata: { discordId: this.discordUser.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return Promise.resolve(history as HistoryDocument[]);
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async getServer(serverId: Snowflake) {
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();

                  const server = await usersCollection.findOne({ discordId: this.discordUser.id.toString(), servers: serverId });
                  if (server == null) return Promise.resolve("No server found!");

                  const dateAfter = new Date().getTime();
                  logger.info("Fetched a users server from the DB!", { metadata: { serverId: serverId, discordId: this.discordUser.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return Promise.resolve(server);
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async addUser(player: string, originId: string, RP: number, AP: number, platform: string, serverId: Snowflake | undefined) {
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  const id = this.discordUser.id;
                  return await usersCollection.insertOne({
                        discordId: this.discordUser.id,
                        originId: originId,
                        RP: RP,
                        AP: AP,
                        platform: platform,
                        servers: [serverId],
                        names: {
                              player: player,
                              discord: `${this.discordUser.username}#${this.discordUser.discriminator}`,
                        },
                        updatedAt: new Date(),
                  })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Added a user to the DB!", { metadata: { serverId: serverId, discordId: id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  const id = this.discordUser.id;
                  return await historyCollection.insertOne({
                        discordId: this.discordUser.id,
                        date: new Date(),
                        RP: RP,
                        AP: AP,
                  })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Added history data to the DB!", { metadata: { discordId: id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  const id = this.discordUser.id;
                  return await usersCollection.updateOne({ discordId: this.discordUser.id }, { $push: { servers: serverId } })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Updated a users servers in the DB!", { metadata: { serverId: serverId, discordId: id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  const id = this.discordUser.id;
                  return await usersCollection.updateOne({ discordId: this.discordUser.id }, { $set:{ RP: RP } })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Updated a users RP in the DB!", { metadata: { discordId: id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  const id = this.discordUser.id;
                  return await usersCollection.updateOne({ discordId: this.discordUser.id }, { $set:{ AP: AP } })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Updated a users AP in the DB!", { metadata: { discordId: id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  const id = this.discordUser.id;
                  return await usersCollection.deleteOne({ discordId: this.discordUser.id })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Deleted a user from the DB!", { metadata: { discordId: id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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

export class DBServer {
      guild: Guild;
      constructor(guild: Guild) {
            this.guild = guild;
      }

      public async addServer() {
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  const id = this.guild.id;
                  return await guildCollection.insertOne({
                        serverId: this.guild.id,
                        name: this.guild.name,
                  })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Added a server to the DB!", { metadata: { serverId: id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  await guildCollection.deleteOne({ serverId: this.guild.id });

                  const dateAfter = new Date().getTime();
                  logger.info("Deleted a server from the DB!", { metadata:{ serverId: this.guild.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return;
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async getTopUsers() {
            try {
                  const dateBefore = new Date().getTime();
                  await DBClient.connect();

                  const users = await usersCollection.find({ servers: this.guild.id }).sort({ RP: -1 }).toArray();

                  if (users.length == 0) return Promise.resolve("No user data!");
                  const dateAfter = new Date().getTime();
                  logger.info("Fetched users from the DB!", { metadata:{ serverId: this.guild.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return Promise.resolve(users);
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }
}