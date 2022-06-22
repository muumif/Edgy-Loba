const { SlashCommandBuilder } = require("@discordjs/builders");
require("dotenv").config();
const { MessageEmbed, DiscordAPIError } = require("discord.js");
const { getTopGuildUsers, getGuildSettings, getUserHistoryGame, getUserHistory } = require("../database/db");
const { makeTopChart } = require("../moduels/charts");
const { logger } = require("../moduels/logger");
const { UIDToIGN } = require("../moduels/UIDToIGN");

async function fetchUser(client, id, guildID) {
	return await client.users.fetch(id).then(result => {
		logger.info("Discord API fetched user!", { command: "top", guildID: guildID, discordID: id, user: result });
		return result;
	});
}

async function getData(guildID) {
	return await getTopGuildUsers(guildID).then(result => {
		return result;
	}).catch(err => {
		return Promise.reject(err);
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("top")
		.setDescription("Shows the top 10 users in the server."),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		try {
			const topData = await getData(interaction.guildId);
			const embed = new MessageEmbed()
				.setTitle("Server Leaderboard")
				.setColor("#e3a600")
				.setFooter({
					text: "Top 10",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				})
				.setTimestamp();

			const users = topData.length, usersHistory = [];

			for (let i = 0; i < topData.length; i++) {
				const fetch = await fetchUser(interaction.client, topData[i].discordID, interaction.guildId);
				topData[i].IGN = await UIDToIGN(topData[i].originUID, topData[i].platform, interaction.guildId, interaction.user.id);
				topData[i].discordName = fetch.username;
				topData[i].discordDiscriminator = fetch.discriminator;
				if (fetch.avatarURL() == null) {
					topData[i].discordImg = "https://cdn.discordapp.com/embed/avatars/2.png";

				}
				else {
					topData[i].discordImg = fetch.avatarURL();
				}
				await getGuildSettings(interaction.guildId).then(settings => {
					if (settings.settings.modePref == "BR") {
						embed.addField((i + 1) + ". " + topData[i].IGN + " / " + topData[i].discordName + "#" + topData[i].discordDiscriminator, "RP: " + topData[i].RP, false);
					}
					if (settings.settings.modePref == "AR") {
						embed.addField((i + 1) + ". " + topData[i].IGN + " / " + topData[i].discordName + "#" + topData[i].discordDiscriminator, "AP: " + topData[i].AP, false);
					}
				});

				/*
				const historyData = await getUserHistory(topData[i].discordID);
				const labels = [], data = [];
				for (let j = 0; j < historyData.length; j++) {
					const date = new Date(historyData[j].date).getUTCDate() + "/" + (new Date(historyData[j].date).getUTCMonth() + 1) + "/" + new Date(historyData[j].date).getUTCFullYear();
					labels.push(date);
					data.push(historyData[j].RP);
				}
				usersHistory.push({ dates: labels, rps: data });*/
			}

			embed.setThumbnail(topData[0].discordImg);
			/*
			await makeTopChart(usersHistory, users, interaction.guildId);
			console.log(usersHistory[0].rps + " | " + users);*/

			return await interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			if (error.response) {
				logger.error(new Error(error), { command: "top", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString()).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
			if (error) {
				logger.error(new Error(error), { command: "top", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription("Please try again later!").setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
		}

	},
};