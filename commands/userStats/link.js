const Discord = require("discord.js");
const axios = require("axios");
const { getUser } = require("../../database/firebaseGet");
const { writeUserData, writeHistoryData } = require("../../database/firebaseSet");
const { getUserUID } = require("../../moduels/getUID");
require("dotenv").config();

async function makeLinkEmbed(IGN, platform, guildID, userID, messageAuthor) {
	return getUser(guildID, userID).then(snapshot => {
		if (snapshot.exists()) {
			const embed = new Discord.MessageEmbed()
				.setTitle("Username already linked!")
				.setDescription("Use command **>unlink** to unlink your account! \nAccount needs to be verified again when unlinked!")
				.setColor("#e3a600");
			return embed;
		}
		else {
			if (IGN == undefined) {
				const embed = new Discord.MessageEmbed()
					.setTitle("No username given!")
					.setDescription(">link **[Apex IGN] [PC | xbox | playstation | switch]**")
					.setColor("#e3a600");
				return embed;
			}
			if (platform == undefined) {
				const embed = new Discord.MessageEmbed()
					.setTitle("No platform given!")
					.setDescription(`>link **${IGN} [PC | xbox | Playstation | Switch]**`)
					.setColor("#e3a600");
				return embed;
			}
		}

		if (platform == "pc" || platform == "ORIGIN" || platform == "origin") {
			platform = "PC";
		}
		if (platform == "x" || platform == "X" || platform == "xbox" || platform == "XBOX" || platform == "x1") {
			platform = "X1";
		}
		if (platform == "ps" || platform == "PS" || platform == "playstation" || platform == "PLAYSTATION" || platform == "ps4" || platform == "PS4" || platform == "ps5" || platform == "PS5") {
			platform = "PS4";
		}
		if (platform == "switch" || platform == "nintendo" || platform == "NINTENDO") {
			platform = "SWITCH";
		}

		return getUserUID(IGN, platform).then(UID => {
			const URI = `${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}`;
			return axios.get(encodeURI(URI))
				.then(function(response) {
					writeUserData(guildID, userID, UID, response.data.global.rank.rankScore, platform);
					writeHistoryData(guildID, userID, response.data.global.rank.rankScore);

					const embed = new Discord.MessageEmbed()
						.setTitle("IGN has been successfully linked!")
						.setDescription(`${messageAuthor} linked to **${response.data.global.name}** using **${platform}**`)
						.setColor("#e3a600");
					return embed;
				}).catch(function(error) {
					const embed = new Discord.MessageEmbed()
						.setTitle("An error accured")
						.setColor("#e3a600");
					switch (error.response) {
					case 400:
						embed.setDescription("Something went wrong. Try again in a few minutes.");
						return Promise.reject(embed);
					case 403:
						embed.setDescription("Unauthorized / Unknown API key. The bot might be worked on at this moment. If this continues to happen report it with /bug.");
						return Promise.reject(embed);
					case 404:
						embed.setDescription("Player could not be found. If this continues to happen check that you are using your origin username or report the bug with /bug.");
						return Promise.reject(embed);
					case 405:
						embed.setDescription("External API error. Try again in a few seconds.");
						return Promise.reject(embed);
					case 410:
						embed.setDescription("Unknown platform provided. If this continues to happen report it as a bug with /bug");
						return Promise.reject(embed);
					case 429:
						embed.setDescription("API Rate limit reached. Try again in a few seconds.");
						return Promise.reject(embed);
					case 500:
						embed.setDescription("API Internal error.");
						return Promise.reject(embed);
					}
				});
		});
	}).catch(error => {
		return Promise.reject(error);
	});
}

module.exports = {
	makeLinkEmbed,
};