import axios from "axios";
import { AttachmentBuilder, CommandInteraction, GuildEmoji, SlashCommandBuilder } from "discord.js";
import { makeStatsChart } from "../../components/charts";
import { emojis, filename } from "../../components/const";
import { DBUser } from "../../components/mongo";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { ALSUserData } from "../../types/als";
import { HistoryDocument, UserDocument } from "../../types/mongo";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("me")
            .setDescription("Shows your own stats if an account has been linked"),
      async execute(interaction: CommandInteraction) {
            try {
                  const dbUser = new DBUser(interaction.user);

                  // eslint-disable-next-line prefer-const
                  let [dbUserData, dbServerData] = await Promise.all([dbUser.getUser(), dbUser.getServer(interaction.guildId as string)]);
                  if (dbServerData == "No server found!") {
                        await dbUser.addServer(interaction.guildId as string);
                  }
                  if (dbUserData == "User not found!") {
                        const meEmbed = new embed().errorEmbed()
                              .setTitle("User not linked!")
                              .setDescription("Use the `/link` command to link and use this db!");
                        await interaction.editReply({ embeds: [meEmbed] });
                        return;
                  }

                  dbUserData = dbUserData as UserDocument;
                  let selectedTrackers = "```ansi", platformEmoji: GuildEmoji, stateEmoji: GuildEmoji, currentState: string;
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

                  const rankBR = ALSUser.global.rank.rankName == "Apex Predator" ? `\u001b[0;37m#${ALSUser.global.rank.ladderPosPlatform} \u001b[0;31mPredator` : `\u001b[0;37m${ALSUser.global.rank.rankName} \u001b[0;33m${ALSUser.global.rank.rankDiv}`;
                  const rankAR = ALSUser.global.arena.rankName == "Apex Predator" ? `\u001b[0;37m#${ALSUser.global.arena.ladderPosPlatform} \u001b[0;31mPredator` : `\u001b[0;37m${ALSUser.global.arena.rankName} \u001b[0;33m${ALSUser.global.arena.rankDiv}`;
                  const rankIMG = ALSUser.global.rank.rankScore >= ALSUser.global.arena.rankScore ? ALSUser.global.rank.rankImg : ALSUser.global.arena.rankImg;
                  const level = ALSUser.global.levelPrestige == 0 ? `${"```ansi"}\n\u001b[0;33m${ALSUser.global.level} \n${ALSUser.global.toNextLevelPercent}\u001b[0;37m% /\u001b[0;33m 100\u001b[0;37m%${"```"}` : `${"```ansi"}\n\u001b[0;33m${ALSUser.global.level}\n\u001b[0;37mPrestige \u001b[0;33m${ALSUser.global.levelPrestige} \n${ALSUser.global.toNextLevelPercent}\u001b[0;37m% /\u001b[0;33m 100\u001b[0;37m%${"```"}`;

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
                                    name: "Battle Royal",
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

                  await Promise.all([
                        dbUser.updateRP(ALSUser.global.rank.rankScore),
                        dbUser.updateAP(ALSUser.global.arena.rankScore),
                        dbUser.updateNames(ALSUser.global.name),
                  ]);

                  let dbUserHistory = await dbUser.getHistory() as HistoryDocument[] | string;
                  if (dbUserHistory == "No history data was found!") {
                        const discordUser = await interaction.client.users.fetch(dbUser.discordUser.id);
                        meEmbed.setDescription(`${stateEmoji} ${currentState} \n Linked to **${discordUser.username}#${discordUser.discriminator}**`);

                        await interaction.editReply({ embeds: [meEmbed] });
                  }
                  else {
                        dbUserHistory = dbUserHistory as HistoryDocument[];

                        const [ fileName, discordUser] = await Promise.all([
                              makeStatsChart(dbUserHistory, ALSUser.global.rank.rankScore, dbUser.discordUser.id),
                              interaction.client.users.fetch(dbUser.discordUser.id),
                        ]);

                        meEmbed.setDescription(`${stateEmoji} ${currentState} \n Linked to **${discordUser.username}#${discordUser.discriminator}**`);
                        const meFile = new AttachmentBuilder(`${fileName}`);
                        meEmbed.setImage(`attachment://${filename(fileName)}`);

                        await interaction.editReply({ embeds: [meEmbed], files: [meFile] });
                  }
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