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
				const user = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${userDB.originUID}&platform=${userDB.platform}`));

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
					rankBR = `#${user.data.global.rank.ladderPosPlatform} Predator`;
				}
				else {
					rankBR = `${user.data.global.rank.rankName} ${user.data.global.rank.rankDiv}`;
				}
				if (user.data.global.arena.rankName == "Apex Predator") { // Check if the user is an Apex Predator
					rankAR = `#${user.data.global.arena.ladderPosPlatform} Predator`;
				}
				else {
					rankAR = `${user.data.global.arena.rankName} ${user.data.global.arena.rankDiv}`;
				}

				if (user.data.global.rank.rankScore >= user.data.global.arena.rankScore) { // Show the img for which the player has more score for
					rankIMG = user.data.global.rank.rankImg;
				}
				else {
					rankIMG = user.data.global.arena.rankImg;
				}


				const embed = new MessageEmbed()
					.setTitle(`${platformEmoji}  ${user.data.global.name}`)
					.setThumbnail(rankIMG)
					.setDescription(`${stateEmoji} ${currentState}`)
					.addFields(
						{
							name: "__Level__",
							value: `${user.data.global.level} \n ${user.data.global.toNextLevelPercent}%`,
							inline: true,
						},
						{
							name: "__Battle Royal__",
							value: `${rankBR} \nRP: ${user.data.global.rank.rankScore}`,
							inline: true,
						},
						{
							name: "__Arenas__",
							value: `${rankAR} \nAP: ${user.data.global.arena.rankScore}`,
							inline: true,
						},
					)
					.setColor("#e3a600")
					.setTimestamp()
					.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" });


				
				const historyData = await getUserHistory(userDB.discordID);
				if (historyData != "No history data exists for given user!") {
					const labels = [], data = [];
					for (let i = 0; i < historyData.length; i++) {
						const date = new Date(historyData[i].date).getUTCDate() + "/" + (new Date(historyData[i].date).getUTCMonth() + 1) + "/" + new Date(historyData[i].date).getUTCFullYear();
						labels.push(date);
						data.push(historyData[i].RP);
					}

					await makeStatsChart(labels, data, userDB.discordID);
					const statsFile = new MessageAttachment(`./temp/history_${userDB.discordID}.png`);
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