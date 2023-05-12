import { AttachmentBuilder, CommandInteraction, GuildEmoji, SlashCommandBuilder } from "discord.js";
import { DBUser } from "../../components/mongo";
import { embed } from "../../components/embeds";
import { HistoryDocument, UserDocument } from "../../types/mongo";
import axios from "axios";
import { emojis, filename } from "../../components/const";
import { makeStatsChart } from "../../components/charts";
import { ALSUserData } from "../../types/als";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("whois")
            .setDescription("See server members stats!")
            .addUserOption(option => {
                  option
                        .setName("user")
                        .setDescription("The user you want to check!")
                        .setRequired(true);
                  return option;
            }),
      async execute(interaction: CommandInteraction) {
            const user = await interaction.client.users.fetch(interaction.options.get("user")?.value as string);
            const dbUser = new DBUser(user);
            let dbUserData = await dbUser.getUser();
            let dbUserHistory = await dbUser.getHistory();

            if (dbUserData == "User not found!") {
                  await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("User not found!").setDescription("This user has not linked their account!")] });
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
            const rankIMG = ALSUser.global.rank.rankImg;
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
                              name: "Ranked",
                              value: `${"```ansi"}\n\u001b[0;33m${rankBR} \n\u001b[0;37mLP: \u001b[0;33m${ALSUser.global.rank.rankScore}${"```"}`,
                              inline: true,
                        },
                  );

            if (selectedLegend?.data == undefined) {
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
      },
};