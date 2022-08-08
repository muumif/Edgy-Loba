import axios from "axios";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { filename } from "../../components/const";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { CraftingData } from "../../types/als";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("crafting")
            .setDescription("Shows the current items that can be crafted at the replicator!"),

      async execute(interaction: CommandInteraction) {

            try {
                  const craftingData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/crafting?auth=${process.env.ALS_TOKEN}`))).data as CraftingData[];
                  const craftingEmbed = new embed().defaultEmbed()
                        .setTitle("Crafting Rotation");


                  const timer = (endTime: number) => {
                        const milliSeconds = new Date(endTime * 1000).getTime() - new Date().getTime();
                        const days = Math.floor(milliSeconds / 86400000);
                        const hours = Math.floor(milliSeconds / 3600000) - (days * 24);
                        const minutes = Math.floor(milliSeconds / 60000) - ((days * 24) * 60) - (hours * 60);
                        const seconds = Math.floor(milliSeconds / 1000) - (((days * 24) * 60) * 60) - ((hours * 60) * 60) - (minutes * 60);
                        return {
                              seconds: seconds,
                              minutes: minutes,
                              hours: hours,
                              days: days,
                        };

                  };

                  craftingData.forEach(crafting => {
                        crafting.bundleContent.forEach(bundle => {
                              let color;
                              switch (bundle.itemType.rarity) {
                              case "Common":
                                    color = "\u001b[0;36m";
                                    break;
                              case "Rare":
                                    color = "\u001b[0;34m";
                                    break;
                              case "Epic":
                                    color = "\u001b[0;35m";
                                    break;
                              case "Legendary":
                                    color = "\u001b[0;33m";
                                    break;
                              }

                              if (crafting.bundleType != "permanent") {
                                    craftingEmbed.addFields({
                                          name: String(crafting.bundleType).charAt(0).toUpperCase() + String(crafting.bundleType).slice(1),
                                          value: `${"```ansi"}\n\u001b[0;37mItem: ${color}${String(bundle.itemType.name).replace("_", " ").replace("_", " ").charAt(0).toUpperCase() + String(bundle.itemType.name).replace("_", " ").replace("_", " ").slice(1) }\n\u001b[0;37mCost: \u001b[0;33m${bundle.cost}\n\u001b[0;37mEnds In: \n\u001b[0;33m${timer(crafting.end).days}\u001b[0;37mD - \u001b[0;33m${timer(crafting.end).hours}\u001b[0;37mH\n\u001b[0;33m${timer(crafting.end).minutes}\u001b[0;37mmin - \u001b[0;33m${timer(crafting.end).seconds}\u001b[0;37msec${"```"}`,
                                          inline: true,
                                    });
                              }
                              else if (bundle.itemType.name != "ammo") {
                                    craftingEmbed.addFields({
                                          name: String(crafting.bundleType).charAt(0).toUpperCase() + String(crafting.bundleType).slice(1),
                                          value: `${"```ansi"}\n\u001b[0;37mItem: ${color}${String(bundle.itemType.name).replace("_", " ").replace("_", " ").charAt(0).toUpperCase() + String(bundle.itemType.name).replace("_", " ").replace("_", " ").slice(1)}\n\u001b[0;37mCost: \u001b[0;33m${bundle.cost}\n\u001b[0;37m${"```"}`,
                                          inline: true,
                                    });
                              }
                        });
                  });

                  return await interaction.editReply({ embeds: [craftingEmbed] });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
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