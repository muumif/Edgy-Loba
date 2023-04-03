import axios from "axios";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { filename } from "../../components/const";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { PredatorData } from "../../types/als";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("predator")
            .setDescription("Shows how much RP is needed to reach Predator on all platforms"),
      async execute(interaction: CommandInteraction) {
            try {
                  const predatorData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/predator?auth=${process.env.ALS_TOKEN}`))).data as PredatorData;
                  const totalMastersBRPC = predatorData.RP.PC.totalMastersAndPreds >= 750 ? predatorData.RP.PC.totalMastersAndPreds - 750 : "No master players!";
                  const totalMastersBRX1 = predatorData.RP.X1.totalMastersAndPreds >= 750 ? predatorData.RP.X1.totalMastersAndPreds - 750 : "No master players!";
                  const totalMastersBRPS = predatorData.RP.PS4.totalMastersAndPreds >= 750 ? predatorData.RP.PS4.totalMastersAndPreds - 750 : "No master players!";

                  const predEmbed = new embed().defaultEmbed()
                        .setTitle("Predator")
                        .setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
                        .addFields(
                              {
                                    name: "PC",
                                    value: "Needed to reach: **" + predatorData.RP.PC.val + ` RP**\nTotal Masters: **${totalMastersBRPC}**`,
                                    inline: false,
                              },
                              {
                                    name: "XBOX",
                                    value: "Needed to reach: **" + predatorData.RP.X1.val + ` RP**\nTotal Masters: **${totalMastersBRX1}**`,
                                    inline: false,
                              },
                              {
                                    name: "Playstation",
                                    value: "Needed to reach: **" + predatorData.RP.PS4.val + ` RP**\nTotal Masters: **${totalMastersBRPS}**`,
                                    inline: false,
                              },
                        );
                  await interaction.editReply({ embeds: [predEmbed] });
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