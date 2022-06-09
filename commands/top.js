const { SlashCommandBuilder } = require("@discordjs/builders");
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const { getTopGuildUsers, getGuildSettings } = require("../database/db");
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
		interaction.deferReply();
		const topData = await getData(interaction.guildId);
		const embed = new MessageEmbed()
			.setTitle("Server Leaderboard")
			.setColor("#e3a600")
			.setTimestamp();
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
		}

		embed.setThumbnail(topData[0].discordImg);

		interaction.editReply({ embeds: [embed] });
	},
};