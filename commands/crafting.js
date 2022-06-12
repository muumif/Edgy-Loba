const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const { logger } = require("../moduels/logger");

async function getData(guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/crafting?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			logger.info("API fetched crafting data!", { command: "crafting", guildID: guildID, discordID: discordID });
			return response;
		}).catch(error => {
			const embed = new MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				logger.error(new Error(error), { command: "crafting", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				logger.error(new Error(error), { command: "crafting", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				logger.error(new Error(error), { command: "crafting", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "crafting", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				logger.error(new Error(error), { command: "crafting", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "crafting", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 500:
				embed.setTitle("API Internal error.");
				logger.error(new Error(error), { command: "crafting", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			}
		});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("crafting")
		.setDescription("Shows the current items that can be crafted at the replicator!"),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const craftingData = await getData();
		const embed = new MessageEmbed()
			.setTitle("Crafting Rotation")
			.addFields(
				{
					name: "__Daily__",
					value: "**1. " + craftingData.data[0].bundleContent[0].itemType.rarity + " " + craftingData.data[0].bundleContent[0].itemType.name + "**\nCost: " + craftingData.data[0].bundleContent[0].cost + " CM\n**2. " + craftingData.data[0].bundleContent[1].itemType.rarity + " " + craftingData.data[0].bundleContent[1].itemType.name + "**\nCost: " + craftingData.data[0].bundleContent[1].cost + " CM",
					inline: true,
				},
				{
					name: "__Weekly__",
					value: "**1. " + craftingData.data[1].bundleContent[0].itemType.rarity + " " + craftingData.data[1].bundleContent[0].itemType.name + "**\nCost: " + craftingData.data[1].bundleContent[0].cost + " CM\n**2. " + craftingData.data[1].bundleContent[1].itemType.rarity + " " + craftingData.data[1].bundleContent[1].itemType.name + "**\nCost: " + craftingData.data[1].bundleContent[1].cost + " CM",
					inline: true,
				},
			)
			.setColor("#e3a600")
			.setFooter({ text: "Bugs can be reported with >bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
			.setTimestamp();
		interaction.reply({ embeds: [embed] });
	},
};