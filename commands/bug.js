const { SlashCommandBuilder } = require("@discordjs/builders");
require("dotenv").config();
const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bug")
		.setDescription("Report a bug!"),
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const modal = new Modal()
			.setCustomId("bugReport")
			.setTitle("Bug Report");

		const commandInput = new TextInputComponent()
			.setCustomId("commandInput")
			.setLabel("What commands has the issue?")
			.setStyle("SHORT")
			.setRequired(true);

		const messageInput = new TextInputComponent()
			.setCustomId("messageInput")
			.setLabel("What is the issue?")
			.setStyle("PARAGRAPH")
			.setRequired(true);

		const firstActionRow = new MessageActionRow().addComponents(commandInput);
		const secondActionRow = new MessageActionRow().addComponents(messageInput);

		modal.addComponents(firstActionRow, secondActionRow);

		return await interaction.showModal(modal);
	},
};