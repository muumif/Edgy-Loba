const { SlashCommandBuilder } = require("@discordjs/builders");
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const { getUserExistsDiscord, deleteUserData } = require("../database/db");


module.exports = {
	data: new SlashCommandBuilder()
		.setName("unlink")
		.setDescription("Unlink your discord account from your Apex username."),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		const userExists = await getUserExistsDiscord(interaction.user.id);
		if (userExists) {
			deleteUserData(interaction.user.id);
			const embed = new MessageEmbed()
				.setTitle("IGN has been successfully unlinked!")
				.setColor("#e3a600")
				.setTimestamp()
				.setFooter({
					text: "Bye bye",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				});
			return await interaction.editReply({ embeds: [embed] });
		}
		else {
			const embed = new MessageEmbed()
				.setTitle("You don't have any linked IGN-s!")
				.setDescription("You can link your username: `/link`")
				.setColor("#e3a600")
				.setTimestamp()
				.setFooter({
					text: "Error",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				});
			return await interaction.editReply({ embeds: [embed] });
		}
	},
};