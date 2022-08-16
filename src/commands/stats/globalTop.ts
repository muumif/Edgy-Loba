import { CommandInteraction, Guild, SlashCommandBuilder } from "discord.js";
import { filename } from "../../components/const";
import { DBGlobal } from "../../components/database";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { UserDocument } from "../../types/mongo";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("gtop")
            .setDescription("Shows the top 3 global users on the bot."),
      async execute(interaction: CommandInteraction) {
            try {
                  let globalTopData = await new DBGlobal().getGlobalTopUsers(interaction.guild as Guild) as UserDocument[] | string;
                  if (globalTopData == "No user data!") {
                        const globalTopEmbed = new embed().errorEmbed()
                              .setTitle("An error accured!")
                              .setDescription("No users exist globally!");
                        return await interaction.editReply({ embeds: [globalTopEmbed] });
                  }

                  globalTopData = globalTopData as UserDocument[];

                  const globalTopEmbed = new embed().defaultEmbed()
                        .setTitle("Bot Global Leaderboard");

                  for (let i = 0; i < globalTopData.length; i++) {
                        const discordUser = await interaction.client.users.fetch(globalTopData[i].discordId);
                        if (i == 0) {
                              if (discordUser.avatarURL() == null) {globalTopEmbed.setThumbnail("https://cdn.discordapp.com/embed/avatars/2.png");}
                              else { globalTopEmbed.setThumbnail(discordUser.avatarURL() as string);}
                        }
                        globalTopEmbed.addFields(
                              {
                                    name: `${i + 1}. ${discordUser.username}`,
                                    value: `RP: ${globalTopData[i].RP}`,
                                    inline: false,
                              },
                        );
                        if (i == globalTopData.length - 1) {
                              await interaction.editReply({ embeds: [globalTopEmbed] });
                        }
                  }
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