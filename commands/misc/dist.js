/**
 * @file Bot /distribution command
 * @author muumif
 * @version 1.0.0
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const axios = require("axios");
const { makeDistribChart } = require("../../misc/charts");
const { logger } = require("../../misc/internal/logger");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("distribution")
		.setDescription("Shows the rank distribution."),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		try {
			const distData = await axios.get(encodeURI("https://apexlegendsstatus.com/lib/php/rankdistrib.php?unranked=yes"));
			const embed = new MessageEmbed()
				.setTitle("Rank Distribution")
				.setDescription("Data from https://apexlegendsstatus.com\nThis data is from all the user that exist in the ALS database.")
				.setColor("#e3a600")
				.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
				.setTimestamp();

			const allCount = () => {
				let count = 0;
				for (let i = 1; i < distData.data.length; i++) {
					count += Number(distData.data[i].totalCount);
				}
				return count;
			};

			for (let i = 1; i < distData.data.length; i++) {
				embed.addField(distData.data[i].name, `${"```ansi\n\u001b[0;33m"}${((Number(distData.data[i].totalCount) / allCount() * 100).toFixed(2)).toString()}\u001b[0;37m%${"```"}`, true);
			}

			await makeDistribChart(distData.data);
			const distribFile = new MessageAttachment("./temp/distChart.png");
			embed.setImage("attachment://distChart.png");

			await interaction.editReply({ embeds: [embed], files: [distribFile] });
		}
		catch (error) {
			if (error.response) {
				logger.error(error, { command: "next", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString()).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
			if (error) {
				logger.error(error, { command: "next", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription("Please try again later!").setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
		}
	},
};