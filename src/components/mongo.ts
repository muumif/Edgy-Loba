import { Client, Guild, Snowflake, User } from "discord.js";
import { MongoClient } from "mongodb";
import { HistoryDocument, UserDocument, ServerDocument, ActiveVotesDocument } from "../types/mongo";
import { filename } from "./const";
import { logger } from "./logger";

const server = `${process.env.MONGO_CONNECTION}/?authSource=admin`;
const DBClient = new MongoClient(server);

let usersCollection = DBClient.db("EdgyLoba").collection("users");
let historyCollection = DBClient.db("EdgyLoba").collection("userHistory");
let guildCollection = DBClient.db("EdgyLoba").collection("guilds");
let bugCollection = DBClient.db("EdgyLoba").collection("bugs");
let logsCollection = DBClient.db("EdgyLoba").collection("logs");
let votingCollection = DBClient.db("EdgyLoba").collection("voting");

if (process.env.NODE_ENV == "development") {
      usersCollection = DBClient.db("EdgyLobaDEV").collection("users");
      historyCollection = DBClient.db("EdgyLobaDEV").collection("userHistory");
      guildCollection = DBClient.db("EdgyLobaDEV").collection("guilds");
      bugCollection = DBClient.db("EdgyLobaDEV").collection("bugs");
      logsCollection = DBClient.db("EdgyLobaDEV").collection("logs");
      votingCollection = DBClient.db("EdgyLobaDEV").collection("voting");
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

      public async addVote(voteDocument: ActiveVotesDocument) {
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();

                  await votingCollection.insertOne(voteDocument)
                        .then(() => {
                              const dateAfter = new Date().getTime();
                              logger.info("Added a vote into the DB!", { metadata: { discordId: voteDocument.discordId, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                        });
                  return Promise.resolve(true);
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      public async removeVote(discordId: Snowflake) {
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();

                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  await votingCollection.updateMany({ discordId: discordId, active: true }, { $set: { active: false } })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Removed a vote from a user!", { metadata: { discordId: discordId, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                              return Promise.resolve("Removed a vote!");
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
                              await DBClient.connect();
                              const DBGuild = await guildCollection.findOne({ serverId: guilds[i].id }) as ServerDocument | null;
                              await DBClient.close();
                              if (DBGuild == null) {
                                    const memberCount = await new DBServer(guilds[i]).memberCount();

                                    const serverDocument: ServerDocument = {
                                          serverId: guilds[i].id,
                                          name: guilds[i].name,
                                          memberCount: memberCount,
                                    };

                                    await DBClient.connect();
                                    await guildCollection.insertOne(serverDocument)
                                          .then(function() {
                                                const dateAfter = new Date().getTime();
                                                logger.info("Added a server to the DB!", { metadata: { file: filename(__filename) } });
                                                return Promise.resolve("Inserted server");
                                          });
                                    await DBClient.close();
                              }
                        }

                        return;
                  };

                  const deleteGuilds = async () => {
                        await DBClient.connect();
                        const DBGuilds = await guildCollection.find({}).toArray() as ServerDocument[] | [];
                        for (let i = 0; i < DBGuilds.length; i++) {
                              if (client.guilds.cache.get(DBGuilds[i].serverId) == undefined) {
                                    await guildCollection.deleteOne({ serverId: DBGuilds[i].serverId });
                                    logger.info("Deleted a server from the DB!", { metadata: { serverId: DBGuilds[i].serverId, file: filename(__filename) } });
                              }
                        }
                        await DBClient.close();
                        return;
                  };

                  await addGuilds();
                  await deleteGuilds();
                  return;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error:any) {
                  return logger.error(error, { metadata: { file: filename(__filename) } });
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

      public async getServers() {
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();

                  let userDocument = await usersCollection.findOne({ discordId: this.discordUser.id }) as UserDocument | null;
                  if (userDocument == null) return Promise.resolve("User doesn't exist in the DB!");
                  userDocument = userDocument as UserDocument;
                  const dateAfter = new Date().getTime();
                  logger.info("Fetched a users servers from the DB!", { metadata: { discordId: this.discordUser.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return Promise.resolve(userDocument.servers);
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

      public async addUser(user: UserDocument) { //player: string, originId: string, RP: number, AP: number, platform: string, serverId: Snowflake | undefined
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  const id = this.discordUser.id;
                  return await usersCollection.insertOne(user)
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Added a user to the DB!", { metadata: { serverId: user.servers, discordId: id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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

                  await usersCollection.updateOne({ discordId: this.discordUser.id }, { $set: { RP: RP, AP: AP } });
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

                  await usersCollection.updateOne({ discordId: this.discordUser.id }, { $set: { updatedAt: new Date() } });
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

      public async updateNames(playerName: string) {
            try {
                  const dateBefore = new Date().getTime();

                  await DBClient.connect();
                  const id = this.discordUser.id;

                  return await usersCollection.updateOne({ discordId: this.discordUser.id }, { $set: { names: { discord: `${this.discordUser.username}#${this.discordUser.discriminator}`, player: playerName } } })
                        .then(function() {
                              const dateAfter = new Date().getTime();
                              logger.info("Updated a users usernames in the DB!", { metadata: { discordId: id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
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

                  await usersCollection.updateOne({ discordId: this.discordUser.id }, { $set: { updatedAt: new Date() } });
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

      public async updateAt(date: Date) {
            try {
                  await DBClient.connect();

                  await usersCollection.updateOne({ discordId: this.discordUser.id }, { $set: { updatedAt: new Date() } });
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

                  const memberCount = await this.memberCount();

                  const serverDocument: ServerDocument = {
                        serverId: this.guild.id,
                        name: this.guild.name,
                        memberCount: memberCount,
                  };

                  return await guildCollection.insertOne(serverDocument)
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

      public async hasFeatureAccess() {
            try {
                  const dateBefore = new Date().getTime();
                  await DBClient.connect();

                  let votes = await votingCollection.find({ servers: this.guild.id, active: true }).toArray() as ActiveVotesDocument[] | [];
                  if (votes == []) return false;
                  votes = votes as ActiveVotesDocument[];

                  const neededVotes = await this.neededVotes();
                  if (votes.length >= 0) {
                        const dateAfter = new Date().getTime();
                        logger.info("Fetched voting collection from the DB!", { metadata:{ serverId: this.guild.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                        return true;
                  }
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      }

      neededVotes = async () => {
            try {
                  const dateBefore = new Date().getTime();
                  await DBClient.connect();

                  let serverDocument = await guildCollection.findOne({ serverId: this.guild.id }) as ServerDocument | null;
                  if (serverDocument == null) return Promise.reject("No server found in the DB!");
                  serverDocument = serverDocument as ServerDocument;

                  let neededVotes = 0;
                  const votesMultiplier = 5; // The amount of users need to get 1 full vote
                  for (let i = 0; i < serverDocument.memberCount; i++) {
                        if (i % votesMultiplier == 0) {
                              neededVotes++;
                        }
                  }

                  const dateAfter = new Date().getTime();
                  logger.info("Needed votes fetched", { metadata:{ serverId: this.guild.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return neededVotes;
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      };

      memberCount = async () => {
            try {
                  await DBClient.connect();
                  const memberCount = (await usersCollection.find({ servers: this.guild.id }).toArray()).length;

                  return memberCount;
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      };

      activeVotes = async () => {
            try {
                  const dateBefore = new Date().getTime();
                  await DBClient.connect();

                  let votes = await votingCollection.find({ servers: this.guild.id, active: true }).toArray() as ActiveVotesDocument[] | [];
                  if (votes == []) return false;
                  votes = votes as ActiveVotesDocument[];

                  const dateAfter = new Date().getTime();
                  logger.info("Active votes fetched", { metadata:{ serverId: this.guild.id, file: filename(__filename), databaseResponseTime: dateAfter - dateBefore } });
                  return votes.length;
            }
            catch (error) {
                  return Promise.reject(error);
            }
            finally {
                  await DBClient.close();
            }
      };
}