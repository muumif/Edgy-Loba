const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const { logger } = require("../moduels/logger");

async function getData(guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/servers?auth=${process.env.ALS_TOKEN}`;
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
		.setName("status")
		.setDescription("Shows the EA servers status and the response time."),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const statusData = await getData(interaction.guildId, interaction.user.id);
		const embed = new MessageEmbed()
			.setTitle("Server Status")
			.setDescription("Data from https://apexlegendsstatus.com")
			.addFields(
				{
					name: ":flag_eu: EU-West",
					value: "Status: " + statusData.data.EA_novafusion["EU-West"].Status + "\nPing: " + statusData.data.EA_novafusion["EU-West"].ResponseTime,
					inline: true,
				},
				{
					name: ":flag_eu: EU-East",
					value: "Status: " + statusData.data.EA_novafusion["EU-East"].Status + "\nPing: " + statusData.data.EA_novafusion["EU-East"].ResponseTime,
					inline: true,
				},
				{
					name: ":flag_us: US-West",
					value: "Status: " + statusData.data.EA_novafusion["US-West"].Status + "\nPing: " + statusData.data.EA_novafusion["US-West"].ResponseTime,
					inline: true,
				},
				{
					name: ":flag_us: US-Central",
					value: "Status: " + statusData.data.EA_novafusion["US-Central"].Status + "\nPing: " + statusData.data.EA_novafusion["US-Central"].ResponseTime,
					inline: true,
				},
				{
					name: ":flag_us: US-East",
					value: "Status: " + statusData.data.EA_novafusion["EU-East"].Status + "\nPing: " + statusData.data.EA_novafusion["EU-East"].ResponseTime,
					inline: true,
				},
				{
					name: ":flag_br: South America",
					value: "Status: " + statusData.data.EA_novafusion.SouthAmerica.Status + "\nPing: " + statusData.data.EA_novafusion.SouthAmerica.ResponseTime,
					inline: true,
				},
				{
					name: ":flag_jp: Asia",
					value:"Status: " + statusData.data.EA_novafusion.Asia.Status + "\nPing: " + statusData.data.EA_novafusion.Asia.ResponseTime,
					inline: true,
				},
			)
			.setColor("#e3a600")
			.setFooter({
				text: "Help Misc - muumif",
				iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
			})
			.setTimestamp();
		interaction.reply({ embeds: [embed] });
	},
};