import { ActionRowBuilder, ModalActionRowComponentBuilder, TextInputBuilder } from "@discordjs/builders";
import { CommandInteraction, ModalBuilder, SlashCommandBuilder, TextInputStyle } from "discord.js";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("bug")
            .setDescription("Report a bug!"),
      async execute(interaction: CommandInteraction) {
            const bugModal = new ModalBuilder()
                  .setCustomId("bugReport")
                  .setTitle("Bug Report");

            // Discord does not currently support SelectMenuBuilder()
            // When ever they do I can use this

            // const commandInput = new SelectMenuBuilder()
            //       .setCustomId("commandInput")
            //       .setPlaceholder("What command has the issue?")
            //       .setMinValues(1)
            //       .setMaxValues(1);
            // commands.forEach(command => {
            //       commandInput.addOptions({ label: `/${command.name}`, value: `command_${command.name}`, description: command.description });
            // });

            const commandInput = new TextInputBuilder()
                  .setCustomId("commandInput")
                  .setLabel("What command has the issue?")
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true);

            const messageInput = new TextInputBuilder()
                  .setCustomId("messageInput")
                  .setLabel("What is the issue?")
                  .setStyle(TextInputStyle.Paragraph)
                  .setRequired(true);

            const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(commandInput);
            const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(messageInput);

            bugModal.addComponents(firstActionRow, secondActionRow);

            return await interaction.showModal(bugModal);
      },
};