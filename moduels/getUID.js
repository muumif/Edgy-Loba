const axios = require("axios");
const JSONBigInt = require("json-bigint")({ "storeAsString": true });
require("dotenv").config();
const Discord = require("discord.js");
const { logger } = require("./logger");

async function getUserUID(IGN, platform, command, guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`;
	return await axios.get(encodeURI(URI), { transformResponse: [data => data] })
		.then(function(response) {
			if (platform == "PC") {
				logger.info("nameToUID API: Succesfully returned data for PC: " + JSONBigInt.parse(response.data).uid, { command: "module: getUID", guildID: guildID, discordID: discordID });
				return JSONBigInt.parse(response.data).uid;
			}
			logger.info("nameToUID API: Succesfully returned data for console: " + JSONBigInt.parse(response.data).result, { command: "module: getUID", guildID: guildID, discordID: discordID });
			return JSONBigInt.parse(response.data).result;
		}).catch(error => {
			const embed = new Discord.MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				logger.error(new Error(error), { command: "module: getUID", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				logger.error(new Error(error), { command: "module: getUID", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				logger.error(new Error(error), { command: "module: getUID", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "module: getUID", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				logger.error(new Error(error), { command: "module: getUID", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "module: getUID", guildID: guildID, discordID: discordID });

				return Promise.reject(embed);
			case 500:
				embed.setTitle("API Internal error.");
				logger.error(new Error(error), { command: "module: getUID", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			}
		});
}

module.exports = {
	getUserUID,
};