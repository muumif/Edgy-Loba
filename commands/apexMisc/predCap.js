const axios = require("axios");
const Discord = require("discord.js");
require("dotenv").config();

async function getData() {
	const URI = `${process.env.ALS_ENDPOINT}/predator?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			return response;
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

async function makePredatorEmbed() {
	return await getData().then(result => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Predator Cap")
			.addFields(
				{
					name: "Battle Royale",
					value: "PC: **" + result.data.RP.PC.val + " RP**\nPlaystation: **" + result.data.RP.PS4.val + " RP**\nXbox: **" + result.data.RP.X1.val + " RP**\nSwitch: **" + result.data.RP.SWITCH.val + " RP**",
					inline: true,
				},
				{
					name: "Arenas",
					value: "PC: **" + result.data.AP.PC.val + " AP**\nPlaystation: **" + result.data.AP.PS4.val + " AP**\nXbox: **" + result.data.AP.X1.val + " AP**\nSwitch: **" + result.data.AP.SWITCH.val + " AP**",
					inline: true,
				},
			)
			.setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
			.setColor("#e3a600");
		return embed;
	}).catch(error => {
		return Promise.reject(error);
	});
}

module.exports = {
	makePredatorEmbed,
};