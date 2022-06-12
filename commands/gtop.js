const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getTopGlobalUsers } = require("../database/db");
const { logger } = require("../moduels/logger");
const { UIDToIGN } = require("../moduels/UIDToIGN");
require("dotenv").config();

async function fetchUser(client, id, guildID) {
	return await client.users.fetch(id).then(result => {
		logger.info("Discord API fetched user!", { command: "gtop", guildID: guildID, discordID: id, user: result });
		return result;
	});
}

async function getData() {
	return await getTopGlobalUsers().then(result => {
		return result;
	}).catch(err => {
		return Promise.reject(err);
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("gtop")
		.setDescription("Shows the top 3 global users on the bot."),
	async execute(interaction) {
		interaction.deferReply();

		const gtopData = await getData();

		const embed = new MessageEmbed()
			.setTitle("Bot Global Leaderboard")
			.setColor("#e3a600")
			.setTimestamp()
			.setFooter({
				text: "Top 3",
				iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
			});


		const discordIDToName = async _ => {
			for (let i = 0; i < gtopData.length; i++) {
				gtopData[i].IGN = await UIDToIGN(gtopData[i].originUID, gtopData[i].platform, interaction.guildId, gtopData[i].discordID);
				if (i == 0) {
					const fetch = await fetchUser(interaction.client, gtopData[i].discordID, interaction.guildId);
					gtopData[i].discordImg = fetch.avatarURL();
					embed.addField((i + 1) + ". " + gtopData[i].IGN, "RP: " + gtopData[i].RP, false);
				}
				else {
					embed.addField((i + 1) + ". " + gtopData[i].IGN, "RP: " + gtopData[i].RP, false);
				}

			}

			embed.setThumbnail(gtopData[0].discordImg);

			interaction.editReply({ embeds: [embed] });
		};

		discordIDToName();
	},
};