import { CommandInteraction, Guild, SlashCommandBuilder } from "discord.js";
import { filename } from "../../components/const";
import { DBServer, DBUser } from "../../components/mongo";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { ALSUserData } from "../../types/als";
import { UserDocument } from "../../types/mongo";
import { createClient } from "redis";
import axios from "axios";

const redisClient = createClient({ url: process.env.REDIS_CONNECTION });
redisClient.on("error", (err) => logger.error(err, { metadata: { file: filename(__filename) } }));

module.exports = {
      data: new SlashCommandBuilder()
            .setName("top")
            .setDescription("Shows the top 10 users in the server."),
      async execute(interaction: CommandInteraction) {
            try {
                  await redisClient.connect();
                  let topData = await new DBServer(interaction.guild as Guild).getTopUsers() as UserDocument[] | string;
                  if (topData == "No user data!") {
                        const topEmbed = new embed().errorEmbed()
                              .setTitle("An error accrued!")
                              .setDescription("No users exist in this server!");
                        return await interaction.editReply({ embeds: [topEmbed] });
                  }
                  topData = topData as UserDocument[];
                  const topEmbed = new embed().defaultEmbed()
                        .setTitle("Server Leaderboard");

                  for (let i = 0; i < topData.length; i++) {
                        if (i == 10) break;
                        let discordName, avatarURL, originIGN, RP;
                        if (await redisClient.exists(topData[i].discordId)) {
                              [discordName, RP, avatarURL, originIGN] = await redisClient.multi()
                                    .hGet(topData[i].discordId, "discordName")
                                    .hGet(topData[i].discordId, "RP")
                                    .hGet(topData[i].discordId, "avatarURL")
                                    .hGet(topData[i].discordId, "originIGN")
                                    .exec();
                              logger.info("Fetched a user from the cache!", { metadata: { discordId: topData[i].discordId, serverId: interaction.guildId, file: filename(__filename) } });
                        }
                        else {
                              const discordUser = await interaction.client.users.fetch(topData[i].discordId);
                              const statsData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${topData[i].originId}&platform=${topData[i].platform}&merge=true&removeMerged=true`))).data as ALSUserData;
                              const dbUser = new DBUser(topData[i].discordId);
                              await dbUser.updateRP(topData[i].RP);
                              RP = statsData.global.rank.rankScore;
                              let avatar;
                              if (discordUser.avatarURL() == null) {avatar = "https://cdn.discordapp.com/embed/avatars/2.png";}
                              else {avatar = discordUser.avatarURL() as string;}
                              [discordName, avatarURL, originIGN] = [discordUser.username, avatar, statsData.global.name];
                              await redisClient.multi()
                                    .hSet(topData[i].discordId, "discordName", discordName)
                                    .hSet(topData[i].discordId, "RP", statsData.global.rank.rankScore)
                                    .hSet(topData[i].discordId, "avatarURL", avatarURL)
                                    .hSet(topData[i].discordId, "originIGN", originIGN)
                                    .expire(topData[i].discordId, 10800)
                                    .exec().then(function() {logger.info("Added a user to the cache!", { metadata: { discordId: discordUser.id, serverId: interaction.guildId, file: filename(__filename) } });});
                        }
                        if (i == 0) {
                              topEmbed.setThumbnail(avatarURL as string);
                        }
                        if (topData[i].discordId == interaction.user.id) {
                              topEmbed.addFields(
                                    {
                                          name: `__${i + 1}. ${originIGN} / ${discordName}__`,
                                          value: `RP: ${RP}`,
                                          inline: false,
                                    },
                              );
                        }
                        else {
                              topEmbed.addFields(
                                    {
                                          name: `${i + 1}. ${originIGN} / ${discordName}`,
                                          value: `RP: ${RP}`,
                                          inline: false,
                                    },
                              );
                        }
                  }
                  await interaction.editReply({ embeds: [topEmbed] });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                  if (error.response) {
                        logger.error(error, { metadata: { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) } });
                        return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString())] });
                  }
                  if (error) {
                        logger.error(error, { metadata: { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) } });
                        return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("Please try again in a few seconds!").setDescription(error.response.request.res.statusMessage.toString())] });
                  }
            }
            finally {
                  await redisClient.disconnect();
            }
      },
};