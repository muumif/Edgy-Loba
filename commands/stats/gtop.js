/**
 * @file Bot /gtop command.
 * @author muumif
 * @version 1.0.0
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getTopGlobalUsers } = require("../../misc/internal/db");
const { logger } = require("../../misc/internal/logger");
require("dotenv").config();

async function fetchUser(client, id) {
	return await client.users.fetch(id).then(result => {
		return result;
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("gtop")
		.setDescription("Shows the top 3 global users on the bot."),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		try {
			const gtopData = await getTopGlobalUsers();
			const embed = new MessageEmbed()
				.setTitle("Bot Global Leaderboard")
				.setColor("#e3a600")
				.setTimestamp()
				.setFooter({
					text: "Top 3 Global",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				});

			const discordIDToName = async _ => {
				for (let i = 0; i < gtopData.length; i++) { // Loop through every user and fetch their Discord name
					const user = await fetchUser(interaction.client, gtopData[i].discordID, interaction.guildId);
					if (i == 0) {
						gtopData[i].discordImg = user.avatarURL();
						embed.addField((i + 1) + ". " + user.username, "RP: " + gtopData[i].RP, false);
					}
					else {
						embed.addField((i + 1) + ". " + user.username, "RP: " + gtopData[i].RP, false);
					}

				}

				embed.setThumbnail(gtopData[0].discordImg);
			};

			await discordIDToName();
			return await interaction.editReply({ embeds: [embed] });
		}
		catch (error) {
			if (error.response) {
				logger.error(new Error(error), { command: "gtop", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString()).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
			if (error) {
				logger.error(new Error(error), { command: "gtop", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription("Please try again later!").setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
		}
	},
};