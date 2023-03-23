import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { embed } from "../../components/embeds";
import { currentSeasonData } from "../../types/als";
import { logger } from "../../components/logger";
import { ansiColors, filename, profilePic } from "../../components/const";
import moment from "moment";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("next")
            .setDescription("Shows when a new split/season starts"),
      async execute(interaction: CommandInteraction) {
            try {
                  const nextData = await (await axios.get(encodeURI("https://api.jumpmaster.xyz/seasons/Current"))).data as currentSeasonData;
                  const nextSeasonEnd = new Date();
                  nextSeasonEnd.setTime(nextData.dates.End * 1000);
                  const nextSplitStart = new Date();
                  nextSplitStart.setTime(nextData.dates.Split * 1000);

                  const nextEmbed = new embed().defaultEmbed()
                        .setTitle("Next Events")
                        .addFields(
                              {
                                    name: "Next Split",
                                    value: `${"```ansi"}\n${ansiColors.White}${moment(nextSplitStart).format("Do MMMM YYYY")}\n${moment(nextSplitStart).fromNow()}${"```"}`,
                                    inline: true,
                              },
                              {
                                    name: "Next Season",
                                    value: `${"```ansi"}\n${ansiColors.White}${moment(nextSeasonEnd).format("Do MMMM YYYY")}\n${moment(nextSeasonEnd).fromNow()}${"```"}`,
                                    inline: true,
                              },

                        )
                        .setFooter({ text: "This data may not be accurate at times. Use /bug to report any issue", iconURL: profilePic(128) });

                  await interaction.editReply({ embeds: [nextEmbed] });
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
      },
};
