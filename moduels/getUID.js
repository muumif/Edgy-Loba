const axios = require("axios");
const JSONBigInt = require("json-bigint")({ "storeAsString": true });
require("dotenv").config();
const Discord = require("discord.js");

async function getUserUID(IGN, platform) {
	const URI = `${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`;
	return await axios.get(encodeURI(URI), { transformResponse: [data => data] })
		.then(function(response) {
			if (platform == "PC") {
				return JSONBigInt.parse(response.data).uid;
			}
			return JSONBigInt.parse(response.data).result;
		}).catch(error => {
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
}

module.exports = {
	getUserUID,
};