import axios from "axios";
import { CommandInteraction, GuildEmoji, SlashCommandBuilder } from "discord.js";
import { emojis, filename } from "../../components/const";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { IGNToUID } from "../../components/uid";
import { ALSUserData } from "../../types/als";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("stats")
            .setDescription("Shows users stats")
            .addStringOption(option => {
                  option
                        .setName("username")
                        .setDescription("The username for user! PC users must use Origin name!")
                        .setRequired(true);
                  return option;
            })
            .addStringOption(option => {
                  option
                        .setName("platform")
                        .setDescription("The platform for user!")
                        .setRequired(true)
                        .addChoices(
                              { name: "PC", value: "link_pc" },
                              { name: "Xbox", value: "link_x1" },
                              { name: "Playstation", value: "link_ps" },
                        );
                  return option;
            }),
      async execute(interaction: CommandInteraction) {
            try {
                  const [username, platformString] = [interaction.options.get("username")?.value as string, interaction.options.get("platform")?.value];

                  let selectedTrackers = "```ansi", platformEmoji: GuildEmoji, stateEmoji: GuildEmoji, currentState: string;
                  const [PCEmoji, PSEmoji, XboxEmoji, OnlineEmoji, IdleEmoji, OfflineEmoji] = emojis(interaction);

                  const platform = () => {
                        switch (platformString) {
                        case "link_pc":
                              return "PC";
                        case "link_x1":
                              return "X1";
                        case "link_ps":
                              return "PS4";
                        default:
                              return "PC";
                        }

                  };
                  const UID = await IGNToUID(username, platform(), interaction.guildId as string, interaction.user.id);
                  const ALSUser = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform()}&merge=true&removeMerged=true`))).data as ALSUserData;
                  const selectedLegend = ALSUser.legends.all[ALSUser.legends.selected.LegendName];

                  // Set a platform emoji for ALSUser embed
                  switch (platform()) {
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

                  const statsEmbed = new embed().defaultEmbed()
                        .setTitle(`${platformEmoji}  ${ALSUser.global.name}`)
                        .setDescription(`${stateEmoji} ${currentState}`)
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
                        statsEmbed.addFields({
                              name: "Arenas",
                              value: `${"```ansi"}\n${rankAR} \n\u001b[0;37mAP: \u001b[0;33m${ALSUser.global.arena.rankScore}${"```"}`,
                              inline: true,
                        });
                  }

                  if (selectedLegend.data == undefined) {
                        statsEmbed.addFields({
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
                              if (i == 6) {
                                    selectedTrackers += "```";
                                    return;
                              }
                        }
                        statsEmbed.addFields({
                              name: `Selected Legend: ${ALSUser.legends.selected.LegendName}`,
                              value: selectedTrackers,
                              inline: false,
                        });
                  }
                  await interaction.editReply({ embeds: [statsEmbed] });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                  if (error.isGetUidError) {
                        logger.error(error, { metadata: { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) } });
                        return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("An error accrued!").setDescription(JSON.parse(error.message).Error)] });
                  }
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