import { CommandInteraction, Guild, SlashCommandBuilder } from "discord.js";
import { filename } from "../../components/const";
import { DBServer } from "../../components/mongo";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { UIDToIGN } from "../../components/uid";
import { UserDocument } from "../../types/mongo";
import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_CONNECTION });
client.on("error", (err) => logger.error(err, { metadata: { file: filename(__filename) } }));

module.exports = {
      data: new SlashCommandBuilder()
            .setName("top")
            .setDescription("Shows the top 10 users in the server."),
      async execute(interaction: CommandInteraction) {
            try {
                  await client.connect();
                  let topData = await new DBServer(interaction.guild as Guild).getTopUsers() as UserDocument[] | string;
                  if (topData == "No user data!") {
                        const topEmbed = new embed().errorEmbed()
                              .setTitle("An error accrued!")
                              .setDescription("No users exist in this server!");
                        return await interaction.editReply({ embeds: [topEmbed] });
                  }
                  topData = topData as UserDocument[];
                  const topEmbed = new embed().defaultEmbed()
                        .setTitle("Server Leaderboard!");
                  for (let i = 0; i < topData.length; i++) {
                        if (i == 5) break;
                        if (await client.exists(`top:${topData[i].discordId}`)) {
                              const data = await client.hGetAll(topData[i].discordId);
                              topEmbed.addFields({
                                    name: `${i + 1}. ${data.username} / ${data.discordUsername}`,
                                    value: `RP: ${data.RP}`,
                                    inline: false,
                              });
                              if (i == 0) topEmbed.setThumbnail(data.thumbnail);
                        }
                        else {
                              const discordUser = await interaction.client.users.fetch(topData[i].discordId);
                              const username = await UIDToIGN(topData[i].originId, topData[i].platform, interaction.guildId as string, topData[i].discordId);
                              await client
                                    .multi()
                                    .hSet(`top:${discordUser.id}`, "RP", topData[i].RP)
                                    .hSet(`top:${discordUser.id}`, "username", username)
                                    .hSet(`top:${discordUser.id}`, "discordUsername", discordUser.username)
                                    .hSet(`top:${discordUser.id}`, "thumbnail", (discordUser.avatarURL()?.toString() as string))
                                    .expire(`top:${discordUser.id}`, 3600)
                                    .exec();
                              if (i == 0) {
                                    if (discordUser.avatarURL() == null) {topEmbed.setThumbnail("https://cdn.discordapp.com/embed/avatars/2.png");}
                                    else { topEmbed.setThumbnail(discordUser.avatarURL() as string);}
                              }
                              topEmbed.addFields(
                                    {
                                          name: `${i + 1}. ${username} / ${discordUser.username}`,
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
                  await client.disconnect();
            }
      },
};