/**
 * @file Bot /next command
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
		.setName("next")
		.setDescription("Shows when a new split or season starts."),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();
		try {
			const data = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/maprotation?version=2&auth=${process.env.ALS_TOKEN}`));
			const nextSplit = new Date(data.data.ranked.next.start * 1000);
			const nextSeason = () => {
				if (data.data.ranked.next.end != 0) { // First split
					return new Date(data.data.ranked.next.end * 1000);
				}
				else { // Second split
					return new Date(data.data.ranked.current.end * 1000);
				}
			};
			const timer = () => {
				if (nextSplit.getUTCSeconds() >= nextSeason().getUTCSeconds()) {
					const milliSeconds = nextSplit.getTime() - new Date().getTime();
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
				}
				else {
					const milliSeconds = nextSplit.getTime() - new Date().getTime();
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
				}
			};

			const embed = new MessageEmbed()
				.setTitle("Next Events")
				.addFields(
					{
						name: "**Next Split**",
						value: `${"```ansi"}\n\u001b[0;33m${String(nextSplit.getUTCDate()).padStart(2, "0")}\u001b[0;37m/\u001b[0;33m${String(nextSplit.getUTCMonth() + 1).padStart(2, "0")}\u001b[0;37m/\u001b[0;33m${nextSplit.getUTCFullYear()}\n${nextSplit.getUTCHours()}\u001b[0;37m:\u001b[0;33m${String(nextSplit.getUTCMinutes()).padStart(2, "0")} \u001b[0;37m(\u001b[0;33mGMT \u001b[0;37m+\u001b[0;33m0\u001b[0;37m)${"```"}`,
						inline: true,
					},
					{
						name: "**Next Season**",
						value: `${"```ansi"}\n\u001b[0;33m${String(nextSeason().getUTCDate()).padStart(2, "0")}\u001b[0;37m/\u001b[0;33m${String(nextSeason().getUTCMonth() + 1).padStart(2, "0")}\u001b[0;37m/\u001b[0;33m${nextSeason().getUTCFullYear()}\n${nextSeason().getUTCHours()}\u001b[0;37m:\u001b[0;33m${String(nextSeason().getUTCMinutes()).padStart(2, "0")} \u001b[0;37m(\u001b[0;33mGMT \u001b[0;37m+\u001b[0;33m0\u001b[0;37m)${"```"}`,
						inline: true,
					},
					{
						name: "**Timer until closest event**",
						value: `${"```ansi"}\n\u001b[0;33m${timer().days} \u001b[0;37mDays / \u001b[0;33m${timer().hours} \u001b[0;37mHours / \u001b[0;33m${timer().minutes} \u001b[0;37mMinutes / \u001b[0;33m${timer().seconds} \u001b[0;37mSeconds ${"```"}`,
						inline: false,
					},
				)
				.setColor("#e3a600")
				.setFooter({ text: "This data may not be accurate at times. Use /bug to report a issue.", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
				.setTimestamp();
			await interaction.editReply({ embeds: [embed] });

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