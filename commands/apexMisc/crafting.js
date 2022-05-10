const axios = require("axios");
const Discord = require("discord.js");
require("dotenv").config();

async function getData() {
	const URI = `${process.env.ALS_ENDPOINT}/crafting?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			return response;
		}).catch(error => {
			const embed = new Discord.MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				return Promise.reject(embed);
			case 500:
				embed.setDescription("API Internal error.");
				return Promise.reject(embed);
			}
		});
}

async function makeCraftingEmbed() {
	return await getData().then(result => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Crafting Rotation")
			.addFields(
				{
					name: "__Daily__",
					value: "**1. " + result.data[0].bundleContent[0].itemType.rarity + " " + result.data[0].bundleContent[0].itemType.name + "**\nCost: " + result.data[0].bundleContent[0].cost + " CM\n**2. " + result.data[0].bundleContent[1].itemType.rarity + " " + result.data[0].bundleContent[1].itemType.name + "**\nCost: " + result.data[0].bundleContent[1].cost + " CM",
					inline: true,
				},
				{
					name: "__Weekly__",
					value: "**1. " + result.data[1].bundleContent[0].itemType.rarity + " " + result.data[1].bundleContent[0].itemType.name + "**\nCost: " + result.data[1].bundleContent[0].cost + " CM\n**2. " + result.data[1].bundleContent[1].itemType.rarity + " " + result.data[1].bundleContent[1].itemType.name + "**\nCost: " + result.data[1].bundleContent[1].cost + " CM",
					inline: true,
				},
			)
			.setColor("#e3a600");
		return embed;
	}).catch(error => {
		return Promise.reject(error);
	});
}

module.exports = {
	makeCraftingEmbed,
};