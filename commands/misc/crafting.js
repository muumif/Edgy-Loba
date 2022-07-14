/**
 * @file Bot /crafting command.
 * @author muumif
 * @version 1.0.0
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { logger } = require("../../misc/internal/logger");
const axios = require("axios");
require("dotenv").config();


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
				.setColor("#e3a600")
				.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
				.setTimestamp();

			const timer = (endTime) => {
				const milliSeconds = new Date(endTime * 1000) - new Date().getTime();
				const days = Math.floor(milliSeconds / 86400000);
				const hours = Math.floor(milliSeconds / 3600000) - (days * 24);
				const minutes = Math.floor(milliSeconds / 60000) - ((days * 24) * 60) - (hours * 60);
				const seconds = Math.floor(milliSeconds / 1000) - (((days * 24) * 60) * 60) - ((hours * 60) * 60) - (minutes * 60);
				return {
					seconds: seconds,
					minutes: minutes,
					hours: hours,
					days: days,
				};

			};

			for (let i = 0; i < craftingData.data.length; i++) {
				for (let j = 0; j < craftingData.data[i].bundleContent.length; j++) {

					let color;
					switch (craftingData.data[i].bundleContent[j].itemType.rarity) {
					case "Common":
						color = "\u001b[0;36m";
						break;
					case "Rare":
						color = "\u001b[0;34m";
						break;
					case "Epic":
						color = "\u001b[0;35m";
						break;
					case "Legendary":
						color = "\u001b[0;33m";
						break;
					}

					if (craftingData.data[i].bundleType != "permanent") {
						embed.addField(String(craftingData.data[i].bundleType).charAt(0).toUpperCase() + String(craftingData.data[i].bundleType).slice(1), `${"```ansi"}\n\u001b[0;37mItem: ${color}${String(craftingData.data[i].bundleContent[j].itemType.name).replace("_", " ").replace("_", " ").charAt(0).toUpperCase() + String(craftingData.data[i].bundleContent[j].itemType.name).replace("_", " ").replace("_", " ").slice(1) }\n\u001b[0;37mCost: \u001b[0;33m${craftingData.data[i].bundleContent[j].cost}\n\u001b[0;37mEnds In: \n\u001b[0;33m${timer(craftingData.data[i].end).days}\u001b[0;37mD - \u001b[0;33m${timer(craftingData.data[i].end).hours}\u001b[0;37mH\n\u001b[0;33m${timer(craftingData.data[i].end).minutes}\u001b[0;37mmin - \u001b[0;33m${timer(craftingData.data[i].end).seconds}\u001b[0;37msec${"```"}`, true);
					}
					else {
						if (craftingData.data[i].bundleContent[j].itemType.name != "ammo") {
							embed.addField(String(craftingData.data[i].bundleType).charAt(0).toUpperCase() + String(craftingData.data[i].bundleType).slice(1), `${"```ansi"}\n\u001b[0;37mItem: ${color}${String(craftingData.data[i].bundleContent[j].itemType.name).replace("_", " ").replace("_", " ").charAt(0).toUpperCase() + String(craftingData.data[i].bundleContent[j].itemType.name).replace("_", " ").replace("_", " ").slice(1)}\n\u001b[0;37mCost: \u001b[0;33m${craftingData.data[i].bundleContent[j].cost}\n\u001b[0;37m${"```"}`, true);

						}

					}

				}
			}


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