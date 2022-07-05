/**
 * @file Bot /link command.
 * @author muumif
 * @version 1.0.0
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getUserUID } = require("../misc/uid");
const { insertNewUser, getUserExistsDiscord } = require("../misc/internal/db");
const { logger } = require("../misc/internal/logger");
const axios = require("axios");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("link")
		.setDescription("Link your Discord account to your Apex Legends username.")
		.addStringOption(option => {
			option
				.setName("username")
				.setDescription("The username for user! PC users must use Origin name!")
				.setRequired(true);
			return option;
		})
		.addStringOption(option => {
			option
				.setName("platform")
				.setDescription("The platform for user!")
				.setRequired(true)
				.addChoices(
					{ name: "PC", value: "link_pc" },
					{ name: "Xbox", value: "link_x1" },
					{ name: "Playstation", value: "link_ps" },
				);
			return option;
		}),
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const user = interaction.options.getString("username");
		let platform = interaction.options.getString("platform");
		if (platform == "link_pc") { platform = "PC"; }
		if (platform == "link_x1") { platform = "X1"; }
		if (platform == "link_ps") { platform = "PS4"; }

		const userExists = await getUserExistsDiscord(interaction.user.id);
		if (userExists) {
			const embed = new MessageEmbed()
				.setTitle("Username already linked!")
				.setDescription("Use command `/unlink` to unlink your account!")
				.setColor("#e3a600")
				.setTimestamp()
				.setFooter({
					text: "Error page",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				});
			return interaction.reply({ embeds: [embed] });
		}
		else {
			try {
				await interaction.deferReply();

				const UID = await getUserUID(user, platform, interaction.guildId, interaction.user.id);
				const userData = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}`));

				await insertNewUser(interaction.guildId, interaction.user.id, UID, userData.data.global.rank.rankScore, userData.data.global.arena.rankScore, platform);

				const embed = new MessageEmbed()
					.setTitle("IGN has been successfully linked!")
					.setDescription(`${interaction.user.username} linked to **${userData.data.global.name}** using **${platform}**`)
					.setColor("#e3a600")
					.setTimestamp()
					.setFooter({
						text: "Unlink with /unlink",
						iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
					});

				return await interaction.editReply({ embeds: [embed] });
			}
			catch (error) {
				if (error.isGetUidError == true) {
					logger.error(new Error(`Module Error: ${error.isGetUidError} | Message: ${error.message}`), { command: "link", guildID: interaction.guildId });
					return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.message).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
				}
				if (error.response) {
					logger.error(new Error(error), { command: "link", guildID: interaction.guildId });
					return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString()).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
				}
				if (error) {
					logger.error(new Error(error), { command: "link", guildID: interaction.guildId });
					return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription("Please try again later!").setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
				}
			}
		}
	},
};