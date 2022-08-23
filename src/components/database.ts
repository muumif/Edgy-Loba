import { Client, Guild, Snowflake } from "discord.js";
import { MongoClient } from "mongodb";
import { HistoryDocument, UserDocument, ServerDocument } from "../types/mongo";
import { filename } from "./const";
import { logger } from "./logger";

const server = `mongodb://${process.env.MONGO_CONNECTION}/?authMechanism=DEFAULT`;
const DBClient = new MongoClient(server);

let usersCollection = DBClient.db("EdgyLoba").collection("users");
let historyCollection = DBClient.db("EdgyLoba").collection("userHistory");
let guildCollection = DBClient.db("EdgyLoba").collection("guilds");
let bugCollection = DBClient.db("EdgyLoba").collection("bugs");

if (process.env.NODE_ENV == "development") {
      usersCollection = DBClient.db("EdgyLobaDEV").collection("users");
      historyCollection = DBClient.db("EdgyLobaDEV").collection("userHistory");
      guildCollection = DBClient.db("EdgyLobaDEV").collection("guilds");
      bugCollection = DBClient.db("EdgyLobaDEV").collection("bugs");
}

export class DBGlobal {
      public async getAllUsers() {
            try {
                  await DBClient.connect();

                  const users = await usersCollection.find().toArray();

                  if (users == null) return Promise.resolve("No user data!");
                  logger.info("Fetched all users from the DB!", { file: filename(__filename) });
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
                  await DBClient.connect();
                  const users = await usersCollection.find().sort({ RP: -1 }).limit(3).toArray();

                  if (users.length == 0) return Promise.resolve("No user data!");
                  logger.info("Fetched users from the DB!", { serverId: guild.id, file: filename(__filename) });
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
                              logger.info("Added a bug into the DB!", { serverId: serverId, discordId: discordId, file: filename(__filename) });
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
                                          logger.info("Added a server to the DB!", { serverId: guilds[i].id, file: filename(__filename) });
                                    });
                              }
                        }
                        return;
                  };

                  const deleteGuilds = async () => {
                        const DBGuilds = await guildCollection.find({}).toArray() as ServerDocument[] | [];
                        if (DBGuilds == []) logger.error("No guilds found!", { file: filename(__filename) }); // Make error for this
                        for (let i = 0; i < DBGuilds.length; i++) {
                              if (client.guilds.cache.get(DBGuilds[i].serverId) == undefined) {
                                    await guildCollection.deleteOne({ serverId: DBGuilds[i].serverId });
                                    logger.info("Deleted a server from the DB!", { serverId: DBGuilds[i].serverId, file: filename(__filename) });
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
                  return logger.error(error, { file: filename(__filename) });
            }
            finally {
                  await DBClient.close();
            }
      }
}

export class DBUser {
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

      public async getHistory(): Promise<string | HistoryDocument[]> {
            try {
                  await DBClient.connect();

                  const history = await historyCollection.find({ discordId: this.discordId.toString() }).sort({ date: 1 }).toArray() as HistoryDocument[] | [];

                  if (history.length == 0) return Promise.resolve("No history data was found!");

                  logger.info("Fetched a users history from the DB!", { discordId: this.discordId, file: filename(__filename) });
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
                  await DBClient.connect();

                  const server = await usersCollection.findOne({ discordId: this.discordId.toString(), servers: serverId });
                  if (server == null) return Promise.resolve("No server found!");

                  logger.info("Fetched a users server from the DB!", { serverId: serverId, discordId: this.discordId, file: filename(__filename) });
                  return Promise.resolve(server);
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
                              logger.info("Updated a users AP in the DB!", { discordId: id, file: filename(__filename) });
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

export class DBServer {
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

      public async getTopUsers() {
            try {
                  await DBClient.connect();

                  const users = await usersCollection.find({ servers: this.guild.id }).sort({ RP: -1 }).limit(10).toArray();

                  if (users.length == 0) return Promise.resolve("No user data!");
                  logger.info("Fetched users from the DB!", { serverId: this.guild.id, file: filename(__filename) });
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