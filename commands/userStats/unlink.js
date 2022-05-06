const Discord = require("discord.js");
const { getUser } = require("../../database/firebaseGet");
const { deleteUserData } = require("../../database/firebaseSet");
require("dotenv").config();

async function makeUnlinkEmbed(guildID, userID) {
	return await getUser(guildID, userID).then(snapshot => {
		if (snapshot.exists()) {
			deleteUserData(guildID, userID);
			const embed = new Discord.MessageEmbed()
				.setTitle("IGN has been successfully unlinked!")
				.setColor("#e3a600");
			return embed;
		}
		else {
			const embed = new Discord.MessageEmbed()
				.setTitle("You don't have any linked IGN-s!")
				.setDescription("You can link your username: **>link [Apex IGN] [PC | xbox | playstation | switch]**")
				.setColor("#e3a600");
			return embed;
		}
	}).catch(error => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error")
			.setDescription(error)
			.setColor("#e3a600");
		return Promise.reject(embed);
	});
}

module.exports = {
	makeUnlinkEmbed,
};