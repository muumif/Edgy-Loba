/**
 * @file Bot /bug command.
 * @author muumif
 * @version 1.0.0
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, Modal, TextInputComponent } = require("discord.js");
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bug")
		.setDescription("Report a bug!"),
	async execute(interaction) {
		if (!interaction.isCommand()) return;

		const modal = new Modal() // Make a pop-up for the but report
			.setCustomId("bugReport")
			.setTitle("Bug Report");

		const commandInput = new TextInputComponent() // Could use dropdown to see all the commands
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