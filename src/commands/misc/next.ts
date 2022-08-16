import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { embed } from "../../components/embeds";
import { MapData } from "../../types/als";
import { logger } from "../../components/logger";
import { filename, profilePic } from "../../components/const";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("next")
            .setDescription("Shows when a new split or season starts."),
      async execute(interaction: CommandInteraction) {
            try {
                  const nextData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/maprotation?version=2&auth=${process.env.ALS_TOKEN}`))).data as MapData;
                  const nextSplit = new Date(nextData.ranked.next.start * 1000);
                  const nextSeason = () => {
                        return new Date(nextData.ranked.next.start * 1000);
                  };
                  const timer = () => {
                        if (nextSplit.getUTCSeconds() >= nextSeason().getUTCSeconds()) {
                              const milliSeconds = nextSplit.getTime() - new Date().getTime();
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
                        }
                        else {
                              const milliSeconds = nextSplit.getTime() - new Date().getTime();
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
                        }
                  };

                  const nextEmbed = new embed().defaultEmbed()
                        .setTitle("Next Events")
                        .addFields(
                              {
                                    name: "**Next Split**",
                                    value: `${"```ansi"}\n\u001b[0;33m${String(nextSplit.getUTCDate()).padStart(2, "0")}\u001b[0;37m/\u001b[0;33m${String(nextSplit.getUTCMonth() + 1).padStart(2, "0")}\u001b[0;37m/\u001b[0;33m${nextSplit.getUTCFullYear()}\n${nextSplit.getUTCHours()}\u001b[0;37m:\u001b[0;33m${String(nextSplit.getUTCMinutes()).padStart(2, "0")} \u001b[0;37m(\u001b[0;33mGMT \u001b[0;37m+\u001b[0;33m0\u001b[0;37m)${"```"}`,
                                    inline: true,
                              },
                              {
                                    name: "**Next Season**",
                                    value: `${"```ansi"}\n\u001b[0;33m${String(nextSeason().getUTCDate()).padStart(2, "0")}\u001b[0;37m/\u001b[0;33m${String(nextSeason().getUTCMonth() + 1).padStart(2, "0")}\u001b[0;37m/\u001b[0;33m${nextSeason().getUTCFullYear()}\n${nextSeason().getUTCHours()}\u001b[0;37m:\u001b[0;33m${String(nextSeason().getUTCMinutes()).padStart(2, "0")} \u001b[0;37m(\u001b[0;33mGMT \u001b[0;37m+\u001b[0;33m0\u001b[0;37m)${"```"}`,
                                    inline: true,
                              },
                              {
                                    name: "**Timer until closest event**",
                                    value: `${"```ansi"}\n\u001b[0;33m${timer().days} \u001b[0;37mDays / \u001b[0;33m${timer().hours} \u001b[0;37mHours / \u001b[0;33m${timer().minutes} \u001b[0;37mMinutes / \u001b[0;33m${timer().seconds} \u001b[0;37mSeconds ${"```"}`,
                                    inline: false,
                              },
                        )
                        .setFooter({ text: "This data may not be accurate at times. Use /bug to report a issue", iconURL: profilePic(128) });

                  await interaction.editReply({ embeds: [nextEmbed] });
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