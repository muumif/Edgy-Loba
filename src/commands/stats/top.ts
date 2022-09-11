import { CommandInteraction, Guild, SlashCommandBuilder } from "discord.js";
import { filename } from "../../components/const";
import { DBServer } from "../../components/database";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { UIDToIGN } from "../../components/uid";
import { UserDocument } from "../../types/mongo";
import { createClient } from "redis";

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
                        let discordName, avatarURL, originIGN;
                        if (await redisClient.exists(topData[i].discordId)) {
                              [discordName, avatarURL, originIGN] = await redisClient.multi()
                                    .hGet(topData[i].discordId, "discordName")
                                    // .hGet(topData[i].discordId, "avatarURL")
                                    .hGet(topData[i].discordId, "originIGN")
                                    .exec();
                        }
                        else {
                              const discordUser = await interaction.client.users.fetch(topData[i].discordId);
                              const originUser = await UIDToIGN(topData[i].originId, topData[i].platform, interaction.guildId as string, topData[i].discordId); // Should query the API and refresh the RP values in the DB
                              let avatar;
                              // if (discordUser.avatarURL() == null) {
                              //       avatar = "https://cdn.discordapp.com/embed/avatars/2.png";
                              // }
                              // else {
                              //       avatar = discordUser.avatarURL() as string;
                              // }
                              [discordName, avatarURL, originIGN] = [discordUser.username, avatar, originUser];
                              await redisClient.multi()
                                    .hSet(topData[i].discordId, "discordName", discordName)
                                    // .hSet(topData[i].discordId, "avatarURL", avatarURL)
                                    .hSet(topData[i].discordId, "originIGN", originIGN)
                                    .expire(topData[i].discordId, 10800)
                                    .exec();
                        }
                        // if (i == 0) {
                        //       topEmbed.setThumbnail(avatarURL as string);
                        // }
                        if (topData[i].discordId == interaction.user.id) {
                              topEmbed.addFields(
                                    {
                                          name: `__${i + 1}. ${originIGN} / ${discordName}__`,
                                          value: `RP: ${topData[i].RP}`,
                                          inline: false,
                                    },
                              );
                        }
                        else {
                              topEmbed.addFields(
                                    {
                                          name: `${i + 1}. ${originIGN} / ${discordName}`,
                                          value: `RP: ${topData[i].RP}`,
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