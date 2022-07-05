/**
 * @file Bot /status command.
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
		.setName("status")
		.setDescription("Shows the EA servers status and the response time."),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		try {
			const statusData = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/servers?auth=${process.env.ALS_TOKEN}`));
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
					text: "Server status",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				})
				.setTimestamp();
			return await interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			if (error.response) {
				logger.error(new Error(error), { command: "status", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString()).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
			if (error) {
				logger.error(new Error(error), { command: "status", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription("Please try again later!").setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
		}

	},
};