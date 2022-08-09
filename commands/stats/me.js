/**
 * @file Bot /me command.
 * @author muumif
 * @version 1.0.0
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { getUserExistsDiscord, getUser, getUserHistory, updateUserRPAP } = require("../../misc/internal/db");
const { makeStatsChart } = require("../../misc/charts");
const { logger } = require("../../misc/internal/logger");
const axios = require("axios");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("me")
		.setDescription("Shows your own stats if an account has been linked!"),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		interaction.deferReply();

		try {
			const exists = await getUserExistsDiscord(interaction.user.id);
			if (exists) {
				let platformEmoji, stateEmoji, rankBR, rankAR, rankIMG, currentState;
				const userDB = await getUser(interaction.user.id);
				const user = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${userDB.originUID}&platform=${userDB.platform}&merge=true&removeMerged=true`));

				if (userDB.platform == "X1") { platformEmoji = interaction.client.emojis.cache.get("987422524654641252");}
				if (userDB.platform == "PS4") { platformEmoji = interaction.client.emojis.cache.get("987422521680855100");}
				if (userDB.platform == "PC") { platformEmoji = interaction.client.emojis.cache.get("987422520363868251");}

				switch (user.data.realtime.currentState) { // Emoji for player real time status
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

				if (user.data.global.rank.rankName == "Apex Predator") { // Check if the user is an Apex Predator
					rankBR = `\u001b[0;37m#${user.data.global.rank.ladderPosPlatform} \u001b[0;31mPredator`;
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

				if (user.data.global.rank.rankScore >= user.data.global.arena.rankScore) { // Show the img for which the player has more score for
					rankIMG = user.data.global.rank.rankImg;
				}
				else {
					rankIMG = user.data.global.arena.rankImg;
				}

				const selectedLegend = user.data.legends.all[user.data.legends.selected.LegendName];


				const embed = new MessageEmbed()
					.setTitle(`${platformEmoji}  ${user.data.global.name}`)
					.setThumbnail(rankIMG)
					.setDescription(`${stateEmoji} ${currentState}`);
					if (user.data.global.levelPrestige != undefined) {
						embed.addFields({
								name: "**Level**",
								value: `${"```ansi"}\n\u001b[0;33m${user.data.global.level}\n\u001b[0;37mPrestige \u001b[0;33m${user.data.global.levelPrestige} \n${user.data.global.toNextLevelPercent}\u001b[0;37m% /\u001b[0;33m 100\u001b[0;37m%${"```"}`,
								inline: true,
						})
					}else {
						embed.addFields({
							name: "**Level**",
							value: `${"```ansi"}\n\u001b[0;33m${user.data.global.level} \n${user.data.global.toNextLevelPercent}\u001b[0;37m% /\u001b[0;33m 100\u001b[0;37m%${"```"}`,
							inline: true,
					})
					}
					embed.addFields(

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
					const statsFile = new MessageAttachment(`./temp/history_${userDB.discordID}.png`);
					embed.setImage(`attachment://history_${userDB.discordID}.png`);
					const discordUser = await interaction.client.users.fetch(userDB.discordID);
					embed.setDescription(`${stateEmoji} ${currentState} \n Linked to ${"**"}${discordUser.username}#${discordUser.discriminator}${"**"}`);

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
				const embed = new MessageEmbed()
					.setTitle("User doesn't exist!")
					.setDescription("Use the `/link` command to use this command!")
					.setColor("#e3a600")
					.setTimestamp()
					.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" });

				return await interaction.editReply({ embeds: [embed] });
			}
		}
		catch (error) {
			if (error.response) {
				logger.error(new Error(error), { command: "stats", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString()).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
			if (error) {
				logger.error(new Error(error), { command: "stats", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription("Please try again later!").setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
		}
	},
};