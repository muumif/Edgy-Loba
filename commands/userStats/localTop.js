const Discord = require("discord.js");
const { getAllGuildUsers } = require("../../database/firebaseGet");
require("dotenv").config();

const client = new Discord.Client();

async function fetchUser(id) {
	return await client.users.fetch(id).then(result => {
		return result;
	});
}

async function getData(guildID) {
	return await getAllGuildUsers(guildID).then(result => {
		const allUsers = [];
		if (!result.exists()) {
			const embed = new Discord.MessageEmbed()
				.setTitle("No user data!")
				.setDescription("No user data has been recorded for this server!")
				.setColor("#e3a600");
			return Promise.reject(embed);
		}
		result.forEach(function(_child) {
			allUsers.push(_child.val());
		});
		allUsers.sort((a, b) => {return b.RP - a.RP;});

		return allUsers;
	}).catch((error) => {
		return Promise.reject(error);
	});
}

async function makeTopEmbed(guildID) {
	return await getData(guildID).then(async result => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Leaderboard")
			.setColor("#e3a600");

		const discordIDToName = async _ => {
			for (let i = 0; i < result.length; i++) {
				const fetch = await fetchUser(result[i].discordID);
				result[i].discordName = fetch.username;
				result[i].discordDiscriminator = fetch.discriminator;
				result[i].discordImg = fetch.avatarURL();
			}

			for (let j = 0, count = 1; j < result.length; j++) {
				embed.addField(count + ". " + result[j].username + " / " + result[j].discordName + "#" + result[j].discordDiscriminator, "RP: " + result[j].RP, false);
				count++;
			}

			embed.setThumbnail(result[0].discordImg);

			return embed;
		};

		const embed_1 = await discordIDToName();
		return embed_1;

	}).catch((error) => {
		return Promise.reject(error);
	});
}

module.exports = {
	makeTopEmbed,
};