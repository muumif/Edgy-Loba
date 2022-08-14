import axios from "axios";
import { AttachmentBuilder, CommandInteraction, GuildEmoji, SlashCommandBuilder } from "discord.js";
import { makeStatsChart } from "../../components/charts";
import { emojis, filename } from "../../components/const";
import { DBUser } from "../../components/database";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { ALSUserData } from "../../types/als";
import { HistoryDocument, UserDocument } from "../../types/mongo";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("me")
            .setDescription("Shows your own stats if an account has been linked!"),
      async execute(interaction: CommandInteraction) {
            try {
                  const dbUser = new DBUser(interaction.user.id);
                  let dbUserData = await dbUser.getUser() as UserDocument | string;
                  if (await dbUser.getServer(interaction.guildId as string) == "No server found!") {
                        await dbUser.addServer(interaction.guildId as string);
                  }
                  if (dbUserData == "User not found!") {
                        const meEmbed = new embed().errorEmbed()
                              .setTitle("User not linked!")
                              .setDescription("Use the `/link` command to link and use this command!");
                        return await interaction.editReply({ embeds: [meEmbed] });
                  }
                  else {
                        dbUserData = dbUserData as UserDocument;
                        let selectedTrackers = "```ansi", level: string, platformEmoji: GuildEmoji, stateEmoji: GuildEmoji, rankBR: string, rankAR: string, rankIMG: string, currentState: string;
                        const ALSUser = (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${dbUserData.originId}&platform=${dbUserData.platform}&merge=true&removeMerged=true`))).data as ALSUserData;
                        const selectedLegend = ALSUser.legends.all[ALSUser.legends.selected.LegendName];

                        const [PCEmoji, PSEmoji, XboxEmoji, OnlineEmoji, IdleEmoji, OfflineEmoji] = emojis(interaction);
                        // Set a platform emoji for ALSUser embed
                        switch (dbUserData.platform) {
                        case "PC":
                              platformEmoji = PCEmoji;
                              break;
                        case "X1":
                              platformEmoji = XboxEmoji;
                              break;
                        case "PS4":
                              platformEmoji = PSEmoji;
                              break;
                        default:
                              platformEmoji = PCEmoji;
                              break;
                        }

                        // Set a state emoji for ALSUser embed
                        switch (ALSUser.realtime.currentState) {
                        case "offline":
                              if (ALSUser.realtime.lobbyState == "invite") {
                                    stateEmoji = IdleEmoji;
                                    currentState = "In lobby (Invite only)";
                                    break;
                              }
                              stateEmoji = OfflineEmoji;
                              currentState = ALSUser.realtime.currentStateAsText;
                              break;
                        case "inLobby": {
                              stateEmoji = IdleEmoji;
                              currentState = ALSUser.realtime.currentStateAsText;
                              break;
                        }
                        default:
                              stateEmoji = OnlineEmoji;
                              currentState = ALSUser.realtime.currentStateAsText;
                              break;
                        }

                        // Check if ALSUser is an Apex Predator
                        if (ALSUser.global.rank.rankName == "Apex Predator") {
                              rankBR = `\u001b[0;37m#${ALSUser.global.rank.ladderPosPlatform} \u001b[0;31mPredator`;
                        }
                        else {
                              rankBR = `\u001b[0;37m${ALSUser.global.rank.rankName} \u001b[0;33m${ALSUser.global.rank.rankDiv}`;
                        }

                        if (ALSUser.global.arena.rankName == "Apex Predator") {
                              rankAR = `\u001b[0;31m#${ALSUser.global.arena.ladderPosPlatform} Predator`;
                        }
                        else {
                              rankAR = `\u001b[0;37m${ALSUser.global.arena.rankName} \u001b[0;33m${ALSUser.global.arena.rankDiv}`;
                        }

                        // Show the img for which the player has more score for
                        if (ALSUser.global.rank.rankScore >= ALSUser.global.arena.rankScore) {
                              rankIMG = ALSUser.global.rank.rankImg;
                        }
                        else {
                              rankIMG = ALSUser.global.arena.rankImg;
                        }

                        // Check if the ALSUser has reached any prestige levels
                        if (ALSUser.global.levelPrestige == 0) {
                              level = `${"```ansi"}\n\u001b[0;33m${ALSUser.global.level} \n${ALSUser.global.toNextLevelPercent}\u001b[0;37m% /\u001b[0;33m 100\u001b[0;37m%${"```"}`;
                        }
                        else {
                              level = `${"```ansi"}\n\u001b[0;33m${ALSUser.global.level}\n\u001b[0;37mPrestige \u001b[0;33m${ALSUser.global.levelPrestige} \n${ALSUser.global.toNextLevelPercent}\u001b[0;37m% /\u001b[0;33m 100\u001b[0;37m%${"```"}`;
                        }

                        const meEmbed = new embed().defaultEmbed()
                              .setTitle(`${platformEmoji}  ${ALSUser.global.name}`)
                              .setThumbnail(rankIMG)
                              .addFields(
                                    {
                                          name: "Level",
                                          value: level,
                                          inline: true,
                                    },
                                    {
                                          name: "Battle Royale",
                                          value: `${"```ansi"}\n\u001b[0;33m${rankBR} \n\u001b[0;37mRP: \u001b[0;33m${ALSUser.global.rank.rankScore}${"```"}`,
                                          inline: true,
                                    },
                              );
                        if (ALSUser.global.arena.rankScore != 0) {
                              meEmbed.addFields({
                                    name: "Arenas",
                                    value: `${"```ansi"}\n${rankAR} \n\u001b[0;37mAP: \u001b[0;33m${ALSUser.global.arena.rankScore}${"```"}`,
                                    inline: true,
                              });
                        }

                        if (selectedLegend.data == undefined) {
                              meEmbed.addFields({
                                    name: `Selected Legend: __${ALSUser.legends.selected.LegendName}__`,
                                    value: "```ansi\n\u001b[0;37mNo trackers selected!```",
                                    inline: false,
                              });
                        }
                        else {
                              for (let i = 0; i < selectedLegend.data.length; i++) {
                                    selectedTrackers += `\n\u001b[0;37m${selectedLegend.data[i].name}: \u001b[0;33m${selectedLegend.data[i].value} \u001b[0;37m(\u001b[0;33m${selectedLegend.data[i].rank.topPercent}\u001b[0;37m%)`;
                                    if (i == selectedLegend.data.length - 1) {
                                          selectedTrackers += "```";
                                    }
                              }
                              meEmbed.addFields({
                                    name: `Selected Legend: ${ALSUser.legends.selected.LegendName}`,
                                    value: selectedTrackers,
                                    inline: false,
                              });
                        }


                        let dbUserHistory = await dbUser.getHistory() as HistoryDocument[] | string;
                        if (dbUserHistory == "No history data was found!") {
                              const discordUser = await interaction.client.users.fetch(dbUser.discordId);
                              meEmbed.setDescription(`${stateEmoji} ${currentState} \n Linked to **${discordUser.username}#${discordUser.discriminator}**`);

                              await interaction.editReply({ embeds: [meEmbed] });
                        }
                        else {
                              await dbUser.updateRP(ALSUser.global.rank.rankScore);
                              await dbUser.updateAP(ALSUser.global.arena.rankScore);

                              const discordUser = await interaction.client.users.fetch(dbUser.discordId);
                              meEmbed.setDescription(`${stateEmoji} ${currentState} \n Linked to **${discordUser.username}#${discordUser.discriminator}**`);

                              dbUserHistory = dbUserHistory as HistoryDocument[];
                              const fileName = await makeStatsChart(dbUserHistory, ALSUser.global.rank.rankScore, dbUser.discordId);
                              const meFile = new AttachmentBuilder(`${fileName}`);
                              meEmbed.setImage(`attachment://${filename(fileName)}`);

                              await interaction.editReply({ embeds: [meEmbed], files: [meFile] });
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