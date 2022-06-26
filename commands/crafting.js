const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const { logger } = require("../misc/internal/logger");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("crafting")
		.setDescription("Shows the current items that can be crafted at the replicator!"),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		try {
			const craftingData = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/crafting?auth=${process.env.ALS_TOKEN}`));
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
				.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
				.setTimestamp();
			return await interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			if (error.response) {
				logger.error(new Error(error), { command: "crafting", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString()).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
			if (error) {
				logger.error(new Error(error), { command: "crafting", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription("Please try again later!").setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
		}
	},
};