const Discord = require("discord.js");
const { getTopGlobalUsers } = require("../../database/db");
const { logger } = require("../../moduels/logger");
const { UIDToIGN } = require("../../moduels/UIDToIGN");
require("dotenv").config();

const client = new Discord.Client();

async function fetchUser(id, guildID) {
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

async function makeGTopEmbed(guildID, discordID) {
	return await getData().then(async result => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Bot Global Leaderboard")
			.setColor("#e3a600")
			.setTimestamp()
			.setFooter("Top 3", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");

		const discordIDToName = async _ => {
			for (let i = 0; i < result.length; i++) {
				result[i].IGN = await UIDToIGN(result[i].originUID, result[i].platform, guildID, discordID);
				if (i == 0) {
					const fetch = await fetchUser(result[i].discordID, guildID);
					result[i].discordImg = fetch.avatarURL();
					embed.addField((i + 1) + ". " + result[i].IGN, "RP: " + result[i].RP, false);
				}
				else {
					embed.addField((i + 1) + ". " + result[i].IGN, "RP: " + result[i].RP, false);
				}

			}

			embed.setThumbnail(result[0].discordImg);

			return embed;
		};

		const embed_1 = await discordIDToName();
		return embed_1;

	}).catch(error => {
		if (error == 404) {
			const embed = new Discord.MessageEmbed()
				.setTitle("No user data!")
				.setDescription("No user data has been recorded for this server!")
				.setColor("#e3a600")
				.setTimestamp()
				.setFooter("Error page", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return Promise.reject(embed);
		}
		return Promise.reject(error);
	});
}

module.exports = {
	makeGTopEmbed,
};