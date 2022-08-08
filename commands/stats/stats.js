/**
 * @file Bot /stats command.
 * @author muumif
 * @version 1.0.0
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { getUserUID } = require("../../misc/uid");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { logger } = require("../../misc/internal/logger");
const { updateUserRPAP, getUserHistory, getUserExistsGame, getUserOrigin } = require("../../misc/internal/db");
const { makeStatsChart } = require("../../misc/charts");
const axios = require("axios");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription("Shows users stats.")
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
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		let platformEmoji, stateEmoji, rankBR, rankAR, rankIMG, currentState, statsFile;

		const username = interaction.options.getString("username");
		let platform = interaction.options.getString("platform");
		if (platform == "link_pc") { platform = "PC"; platformEmoji = interaction.client.emojis.cache.get("987422520363868251");}
		if (platform == "link_x1") { platform = "X1"; platformEmoji = interaction.client.emojis.cache.get("987422524654641252");}
		if (platform == "link_ps") { platform = "PS4"; platformEmoji = interaction.client.emojis.cache.get("987422521680855100");}

		try {
			const UID = await getUserUID(username, platform, interaction.guildId, interaction.user.id);
			await new Promise(resolve => setTimeout(resolve, 400));
			const user = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}&merge=true&removeMerged=true`));

			switch (user.data.realtime.currentState) {
			case "offline":
				if (user.data.realtime.lobbyState == "invite") {
					stateEmoji = interaction.client.emojis.cache.get("987439560856334356");
					currentState = "In lobby (Invite only)";
					break;
				}
				stateEmoji = interaction.client.emojis.cache.get("987434491951841371");
				currentState = user.data.realtime.currentStateAsText;
				break;
			case "inLobby":
				stateEmoji = interaction.client.emojis.cache.get("987439560856334356");
				currentState = user.data.realtime.currentStateAsText;
				break;
			default:
				stateEmoji = interaction.client.emojis.cache.get("987434490525794435");
				currentState = user.data.realtime.currentStateAsText;
				break;
			}

			if (user.data.global.rank.rankName == "Apex Predator") {
				rankBR = `\u001b[0;31m#${user.data.global.rank.ladderPosPlatform} Predator`;
			}
			else {
				rankBR = `\u001b[0;37m${user.data.global.rank.rankName} \u001b[0;33m${user.data.global.rank.rankDiv}`;
			}
			if (user.data.global.arena.rankName == "Apex Predator") {
				rankAR = `\u001b[0;31m#${user.data.global.arena.ladderPosPlatform} Predator`;
			}
			else {
				rankAR = `\u001b[0;37m${user.data.global.arena.rankName} \u001b[0;33m${user.data.global.arena.rankDiv}`;
			}

			if (user.data.global.rank.rankScore >= user.data.global.arena.rankScore) {
				rankIMG = user.data.global.rank.rankImg;
			}
			else {
				rankIMG = user.data.global.arena.rankImg;
			}

			const selectedLegend = user.data.legends.all[user.data.legends.selected.LegendName];
			const embed = new MessageEmbed()
				.setTitle(`${platformEmoji}  ${user.data.global.name}`)
				.setThumbnail(rankIMG)
				.setDescription(`${stateEmoji} ${currentState}`)
				.addFields(
					{
						name: "**Level**",
						value: `${"```ansi"}\n\u001b[0;33m${user.data.global.level} \n${user.data.global.toNextLevelPercent}\u001b[0;37m% /\u001b[0;33m 100\u001b[0;37m%${"```"}`,
						inline: true,
					},
					{
						name: "**Battle Royale**",
						value: `${"```ansi"}\n\u001b[0;33m${rankBR} \n\u001b[0;37mRP: \u001b[0;33m${user.data.global.rank.rankScore}${"```"}`,
						inline: true,
					},

				)
				.setColor("#e3a600")
				.setTimestamp()
				.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" });
			if (selectedLegend.data != undefined){
				let selectedLegendValue = [];
				if (selectedLegend.data[0] != undefined){
					selectedLegendValue.push({
						name: selectedLegend.data[0].name,
						value: selectedLegend.data[0].value,
						topPercent: selectedLegend.data[0].rank.topPercent
					})
				}
				if (selectedLegend.data[1] != undefined) {
					selectedLegendValue.push({
						name: selectedLegend.data[1].name,
						value: selectedLegend.data[1].value,
						topPercent: selectedLegend.data[1].rank.topPercent
					})
				}
				if (selectedLegend.data[2] != undefined) {
					selectedLegendValue.push({
						name: selectedLegend.data[2].name,
						value: selectedLegend.data[2].value,
						topPercent: selectedLegend.data[2].rank.topPercent
					})
				}
				let selectedLegendValueString = "```ansi";
				selectedLegendValue.forEach(function(i, idx, array) {
					if (idx === array.length - 1){
						selectedLegendValueString += `\n\u001b[0;37m${i.name}: \u001b[0;33m${i.value} \u001b[0;37m(\u001b[0;33m${i.topPercent}\u001b[0;37m%)`
						selectedLegendValueString += "```";
						return;
					}
					selectedLegendValueString += `\n\u001b[0;37m${i.name}: \u001b[0;33m${i.value} \u001b[0;37m(\u001b[0;33m${i.topPercent}\u001b[0;37m%)`

				})
				embed.addFields({
					name: `Selected Legend: ${user.data.legends.selected.LegendName}`,
					value: selectedLegendValueString,
					inline: false,
				})
			} else {
				embed.addFields({
					name: `Selected Legend: ${user.data.legends.selected.LegendName}`,
					value: "```ansi\n\u001b[0;37mNo trackers selected!```",
					inline: false,
				})
			}
			if (user.data.global.arena.rankScore != 0) {
				embed.addFields({
					name: "**Arenas**",
					value: `${"```ansi"}\n${rankAR} \n\u001b[0;37mAP: \u001b[0;33m${user.data.global.arena.rankScore}${"```"}`,
					inline: true,
				});
			}

			const exists = await getUserExistsGame(UID);
			if (exists) {
				const userDB = await getUserOrigin(UID);

				const historyData = await getUserHistory(userDB.discordID);
				if (historyData != "No history data exists for given user!") {
					const labels = [], data = [];
					for (let i = 0; i < historyData.length; i++) {
						const date = new Date(historyData[i].date).getUTCDate() + "/" + (new Date(historyData[i].date).getUTCMonth() + 1) + "/" + new Date(historyData[i].date).getUTCFullYear();
						labels.push(date);
						data.push(historyData[i].RP);
						if (i == historyData.length - 1) {
							const today = new Date();
							labels.push(today.getUTCDate() + "/" + (today.getUTCMonth() + 1) + "/" + today.getUTCFullYear());
							data.push(user.data.global.rank.rankScore);
						}
					}

					await makeStatsChart(labels, data, userDB.discordID);
					statsFile = new MessageAttachment(`./temp/history_${userDB.discordID}.png`);
					embed.setImage(`attachment://history_${userDB.discordID}.png`);
					const discordUser = await interaction.client.users.fetch(userDB.discordID);
					embed.setDescription(`${stateEmoji} ${currentState} \n Linked to **${discordUser.username}#${discordUser.discriminator}**`);

					if (interaction.user.id == userDB.discordID) {
						await updateUserRPAP(interaction.user.id, user.data.global.rank.rankScore, user.data.global.arena.rankScore);
					}
					return await interaction.editReply({ embeds: [embed], files: [statsFile] });
				}
				else {
					const discordUser = await interaction.client.users.fetch(userDB.discordID);
					embed.setDescription(`${stateEmoji} ${currentState} \n Linked to **${discordUser.username}#${discordUser.discriminator}**`);
					return await interaction.editReply({ embeds: [embed] });
				}


			}
			else {
				return await interaction.editReply({ embeds: [embed] });
			}
		}
		catch (error) {
			if (error.isGetUidError == true) {
				logger.error(new Error(`Module Error: ${error.isGetUidError} | Message: ${error.message}`), { command: "stats", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.message).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
			if (error.response) {
				logger.error(new Error(error), { command: "stats", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString()).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
			if (error) {
				logger.error(error), { command: "stats", guildID: interaction.guildId };
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription("Please try again later!").setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
		}
	},
};