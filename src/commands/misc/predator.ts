import axios from "axios";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { filename } from "../../components/const";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { PredatorData } from "../../types/als";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("predator")
            .setDescription("Shows how much RP/AP is needed to reach Predator on all platforms.")
            .addStringOption(option =>
                  option.setName("platform")
                        .setDescription("For what platform to search on!")
                        .setRequired(true)
                        .addChoices(
                              { name: "PC", value: "pred_pc" },
                              { name: "XBOX", value: "pred_xbox" },
                              { name: "Playstation", value: "pred_ps" },
                        )),
      async execute(interaction: CommandInteraction) {
            try {
                  const predatorData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/predator?auth=${process.env.ALS_TOKEN}`))).data as PredatorData;
                  const chosenString = interaction.options.get("platform")?.value;

                  switch (chosenString) {
                  case "pred_all": {
                        const totalMastersBR = () => {
                              if (predatorData.RP.PC.totalMastersAndPreds >= 750) {
                                    return predatorData.RP.PC.totalMastersAndPreds - 750;
                              }
                              else {
                                    return "No master players!";
                              }
                        };

                        const totalMastersAR = () => {
                              if (predatorData.AP.PC.totalMastersAndPreds >= 750) {
                                    return predatorData.AP.PC.totalMastersAndPreds - 750;
                              }
                              else {
                                    return "No master players!";
                              }
                        };

                        const predEmbed = new embed().defaultEmbed()
                              .setTitle("Platform PC!")
                              .setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
                              .addFields(

                                    {
                                          name: "Battle Royale",
                                          value: "PC: **" + predatorData.RP.PC.val + ` RP**\nTotal Masters: **${totalMastersBR()}**`,
                                          inline: true,
                                    },
                                    {
                                          name: "Arenas",
                                          value: "PC: **" + predatorData.AP.PC.val + ` AP**\nTotal Masters: **${totalMastersAR()}**`,
                                          inline: true,
                                    },

                              );
                        return await interaction.editReply({ embeds: [predEmbed] });
                  }
                  case "pred_xbox": {
                        const totalMastersBR = () => {
                              if (predatorData.RP.X1.totalMastersAndPreds >= 750) {
                                    return predatorData.RP.X1.totalMastersAndPreds - 750;
                              }
                              else {
                                    return "No master players!";
                              }
                        };

                        const totalMastersAR = () => {
                              if (predatorData.AP.X1.totalMastersAndPreds >= 750) {
                                    return predatorData.AP.X1.totalMastersAndPreds - 750;
                              }
                              else {
                                    return "No master players!";
                              }
                        };

                        const predEmbed = new embed().defaultEmbed()
                              .setTitle("Platform XBOX!")
                              .setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
                              .addFields(

                                    {
                                          name: "Battle Royale",
                                          value: "XBOX: **" + predatorData.RP.X1.val + ` RP**\nTotal Masters: **${totalMastersBR()}**`,
                                          inline: true,
                                    },
                                    {
                                          name: "Arenas",
                                          value: "XBOX: **" + predatorData.AP.X1.val + ` AP**\nTotal Masters: **${totalMastersAR()}**`,
                                          inline: true,
                                    },

                              );
                        return await interaction.editReply({ embeds: [predEmbed] });
                  }

                  case "pred_ps": {
                        const totalMastersBR = () => {
                              if (predatorData.RP.PS4.totalMastersAndPreds >= 750) {
                                    return predatorData.RP.PS4.totalMastersAndPreds - 750;
                              }
                              else {
                                    return "No master players!";
                              }
                        };

                        const totalMastersAR = () => {
                              if (predatorData.AP.PS4.totalMastersAndPreds >= 750) {
                                    return predatorData.AP.PS4.totalMastersAndPreds - 750;
                              }
                              else {
                                    return "No master players!";
                              }
                        };

                        const predEmbed = new embed().defaultEmbed()
                              .setTitle("Platform Playstation!")
                              .setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
                              .addFields(

                                    {
                                          name: "Battle Royale",
                                          value: "Playstation: **" + predatorData.RP.PS4.val + ` RP**\nTotal Masters: **${totalMastersBR()}**`,
                                          inline: true,
                                    },
                                    {
                                          name: "Arenas",
                                          value: "Playstation: **" + predatorData.AP.PS4.val + ` AP**\nTotal Masters: **${totalMastersAR()}**`,
                                          inline: true,
                                    },

                              );
                        return await interaction.editReply({ embeds: [predEmbed] });
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