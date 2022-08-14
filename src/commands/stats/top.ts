import { CommandInteraction, Guild, SlashCommandBuilder, User } from "discord.js";
import { filename } from "../../components/const";
import { DBServer } from "../../components/database";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { UIDToIGN } from "../../components/uid";
import { UserDocument } from "../../types/mongo";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("top")
            .setDescription("Shows the top 10 users in the server."),
      async execute(interaction: CommandInteraction) {
            try {
                  let topData = await new DBServer(interaction.guild as Guild).getTopUsers() as UserDocument[] | string;
                  if (topData == "No user data!") {
                        const topEmbed = new embed().errorEmbed()
                              .setTitle("An error accured!")
                              .setDescription("No users exist in this server!");
                        return await interaction.editReply({ embeds: [topEmbed] });
                  }
                  topData = topData as UserDocument[];
                  const topEmbed = new embed().defaultEmbed()
                        .setTitle("Server Leaderboard");

                  for (let i = 0; i < topData.length; i++) {
                        const discordUser = await interaction.client.users.fetch(topData[i].discordId);
                        const username = await UIDToIGN(topData[i].originId, topData[i].platform, interaction.guildId as string, topData[i].discordId);
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
                  await interaction.editReply({ embeds: [topEmbed] });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error:any) {
                  if (error.response) {
                        logger.error(error, { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) });
                        return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString())] });
                  }
                  if (error) {
                        logger.error(error, { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) });
                        return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("Please try again in a few seconds!").setDescription(error.response.request.res.statusMessage.toString())] });
                  }
            }
      },
};