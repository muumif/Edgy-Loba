const axios = require("axios");
require("dotenv").config();
const Discord = require("discord.js");
const { logger } = require("./internal/logger");

async function UIDToIGN(UID, platform, guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}&skipRank=true`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			logger.info("ALS API fetched user!", { module: "UIDToIGN", guildID: guildID, discordID: discordID, IGN: response.data.global.name, UID: UID, platform: platform });
			return response.data.global.name;
		}).catch(function(error) {
			const embed = new Discord.MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				logger.error(new Error(error), { module: "UIDToIGN", guildID: guildID, discordID: discordID, UID: UID });
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				logger.error(new Error(error), { module: "UIDToIGN", guildID: guildID, discordID: discordID, UID: UID });
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				logger.error(new Error(error), { module: "UIDToIGN", guildID: guildID, discordID: discordID, UID: UID });
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { module: "UIDToIGN", guildID: guildID, discordID: discordID, UID: UID });
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				logger.error(new Error(error), { module: "UIDToIGN", guildID: guildID, discordID: discordID, UID: UID });
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { module: "UIDToIGN", guildID: guildID, discordID: discordID, UID: UID });

				return Promise.reject(embed);
			case 500:
				embed.setTitle("API Internal error.");
				logger.error(new Error(error), { module: "UIDToIGN", guildID: guildID, discordID: discordID, UID: UID });
				return Promise.reject(embed);
			}
		});
}

module.exports = {
	UIDToIGN,
};