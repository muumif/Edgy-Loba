/* eslint-disable no-inner-declarations */
const { SlashCommandBuilder } = require("@discordjs/builders");
const { default: axios } = require("axios");
const { MessageEmbed } = require("discord.js");
const { logger } = require("../misc/internal/logger");
require("dotenv").config();


async function getData(guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/predator?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			logger.info("ALS API fetched predator data!", { command: "pred", guildID: guildID, discordID: discordID });
			return response;
		}).catch(error => {
			const embed = new MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });

				return Promise.reject(embed);
			case 500:
				embed.setTitle("API Internal error.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			}
		});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("predator")
		.setDescription("Shows how much RP/AP is needed to reach Predator on all platforms.")
		.addStringOption(option =>
			option.setName("platform")
				.setDescription("For what platform to search on!")
				.setRequired(true)
				.addChoices(
					{ name: "All", value: "pred_all" },
					{ name: "PC", value: "pred_pc" },
					{ name: "XBOX", value: "pred_xbox" },
					{ name: "Playstation", value: "pred_ps" },
					{ name: "Switch", value: "pred_switch" },
				)),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		const chosenString = interaction.options.getString("platform");
		const mapData = await getData(interaction.guildId, interaction.user.id);

		switch (chosenString) {
		case "pred_all": {
			const embed = new MessageEmbed()
				.setTitle("All Platforms!")
				.addFields(
					{
						name: "Battle Royal",
						value: "PC: **" + mapData.data.RP.PC.val + " RP**\nPlaystation: **" + mapData.data.RP.PS4.val + " RP**\nXbox: **" + mapData.data.RP.X1.val + " RP**\nSwitch: **" + mapData.data.RP.SWITCH.val + " RP**",
						inline: true,
					},
					{
						name: "Arenas",
						value: "PC: **" + mapData.data.AP.PC.val + " AP**\nPlaystation: **" + mapData.data.AP.PS4.val + " AP**\nXbox: **" + mapData.data.AP.X1.val + " AP**\nSwitch: **" + mapData.data.AP.SWITCH.val + " AP**",
						inline: true,
					},
				)
				.setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
				.setColor("#e3a600")
				.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
				.setTimestamp();
			return await interaction.editReply({ embeds: [embed] });
		}

		case "pred_pc": {
			const embed = new MessageEmbed()
				.setTitle("Platform PC!");
			function totalMastersPCBR() {
				if (mapData.data.RP.PC.totalMastersAndPreds >= 750) {
					return mapData.data.RP.PC.totalMastersAndPreds - 750;
				}
				else {
					return "No master players!";
				}
			}
			function totalMastersPCAR() {
				if (mapData.data.AP.PC.totalMastersAndPreds >= 750) {
					return mapData.data.AP.PC.totalMastersAndPreds - 750;
				}
				else {
					return "No master players!";
				}
			}
			embed.addFields(
				{
					name: "Battle Royal",
					value: "PC: **" + mapData.data.RP.PC.val + ` RP**\nTotal Masters: **${totalMastersPCBR()}**`,
					inline: true,
				},
				{
					name: "Arenas",
					value: "PC: **" + mapData.data.AP.PC.val + ` AP**\nTotal Masters: **${totalMastersPCAR()}**`,
					inline: true,
				},
			)
				.setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
				.setColor("#e3a600")
				.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
				.setTimestamp();
			return await interaction.editReply({ embeds: [embed] });
		}

		case "pred_xbox": {
			function totalMastersX1BR() {
				if (mapData.data.RP.X1.totalMastersAndPreds >= 750) {
					return mapData.data.RP.X1.totalMastersAndPreds - 750;
				}
				else {
					return "No master players!";
				}
			}
			function totalMastersX1AR() {
				if (mapData.data.AP.X1.totalMastersAndPreds >= 750) {
					return mapData.data.AP.X1.totalMastersAndPreds - 750;
				}
				else {
					return "No master players!";
				}
			}
			const embed = new MessageEmbed()
				.setTitle("Platform XBOX!")
				.addFields(
					{
						name: "Battle Royal",
						value: "Xbox: **" + mapData.data.RP.X1.val + ` RP**\nTotal Masters: **${totalMastersX1BR()}**`,
						inline: true,
					},
					{
						name: "Arenas",
						value: "Xbox: **" + mapData.data.AP.X1.val + ` AP**\nTotal Masters: **${totalMastersX1AR()}**`,
						inline: true,
					},
				)
				.setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
				.setColor("#e3a600")
				.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
				.setTimestamp();
			return await interaction.editReply({ embeds: [embed] });
		}

		case "pred_ps": {
			function totalMastersPS4BR() {
				if (mapData.data.RP.PS4.totalMastersAndPreds >= 750) {
					return mapData.data.RP.PS4.totalMastersAndPreds - 750;
				}
				else {
					return "No master players!";
				}
			}
			function totalMastersPS4AR() {
				if (mapData.data.AP.PS4.totalMastersAndPreds >= 750) {
					return mapData.data.AP.PS4.totalMastersAndPreds - 750;
				}
				else {
					return "No master players!";
				}
			}
			const embed = new MessageEmbed()
				.setTitle("Platform Playstation!")
				.addFields(
					{
						name: "Battle Royal",
						value: "Playstation: **" + mapData.data.RP.PS4.val + ` RP**\nTotal Masters: **${totalMastersPS4BR()}**`,
						inline: true,
					},
					{
						name: "Arenas",
						value: "PC: **" + mapData.data.AP.PS4.val + ` AP**\nTotal Masters: **${totalMastersPS4AR()}**`,
						inline: true,
					},
				)
				.setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
				.setColor("#e3a600")
				.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
				.setTimestamp();
			return await interaction.editReply({ embeds: [embed] });
		}

		case "pred_switch": {
			function totalMastersSWITCHBR() {
				if (mapData.data.RP.SWITCH.totalMastersAndPreds >= 750) {
					return mapData.data.RP.SWITCH.totalMastersAndPreds - 750;
				}
				else {
					return "No master players!";
				}
			}
			function totalMastersSWITCHAR() {
				if (mapData.data.RP.SWITCH.totalMastersAndPreds >= 750) {
					return mapData.data.RP.SWITCH.totalMastersAndPreds - 750;
				}
				else {
					return "No master players!";
				}
			}
			const embed = new MessageEmbed()
				.setTitle("Platform Switch!")
				.addFields(
					{
						name: "Battle Royal",
						value: "Swtich: **" + mapData.data.RP.SWITCH.val + ` RP**\nTotal Masters: **${totalMastersSWITCHBR()}**`,
						inline: true,
					},
					{
						name: "Arenas",
						value: "Switch: **" + mapData.data.AP.SWITCH.val + `AP**\nTotal Masters: **${totalMastersSWITCHAR()}**`,
						inline: true,
					},
				)
				.setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
				.setColor("#e3a600")
				.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
				.setTimestamp();
			return await interaction.editReply({ embeds: [embed] });
		}

		}


	},
};