import {
      CommandInteraction,
      SlashCommandBuilder,
      APIEmbedField,
      ActionRowBuilder,
      ButtonBuilder,
      ButtonStyle,
} from "discord.js";
import { profilePic, linksField } from "../../components/const";
import { embed } from "../../components/embeds";
import { getCommands } from "../../components/commands";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("help")
            .setDescription("Shows every commands and their description")
            .addStringOption(option =>
                  option
                        .setName("category")
                        .setDescription("The help category!")
                        .setRequired(true)
                        .addChoices(
                              { name: "miscellaneous", value: "help_misc" },
                              { name: "stats", value: "help_stats" },
                        )),
      async execute(interaction: CommandInteraction) {

            const buttons = new ActionRowBuilder<ButtonBuilder>()
                  .addComponents(
                        new ButtonBuilder()
                              .setLabel("Invite me")
                              .setURL("https://bit.ly/3wo2Tkh")
                              .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                              .setLabel("Vote")
                              .setURL("https://top.gg/bot/719542118955090011/vote")
                              .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                              .setLabel("GitHub")
                              .setURL("https://github.com/muumif/")
                              .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                              .setLabel("Terms Of Service")
                              .setURL("https://github.com/muumif/Edgy-Loba/blob/master/TOS.md")
                              .setStyle(ButtonStyle.Link),
                        new ButtonBuilder()
                              .setLabel("Privacy Policy")
                              .setURL("https://github.com/muumif/Edgy-Loba/blob/master/PRIVACY.md")
                              .setStyle(ButtonStyle.Link),
                  );

            const chosenString = interaction.options.get("category")?.value;
            switch (chosenString) {
            case "help_misc": {
                  const helpEmbed = new embed().defaultEmbed()
                        .setTitle("Help Miscellaneous")
                        .setThumbnail(profilePic(512))
                        .addFields(
                              getCommands("misc"),
                        );
                  return await interaction.editReply({ embeds: [helpEmbed], components: [buttons] });
            }
            case "help_stats": {
                  const helpEmbed = new embed().defaultEmbed()
                        .setTitle("Help Stats")
                        .setThumbnail(profilePic(512))
                        .addFields(
                              getCommands("stats"),
                        );
                  return await interaction.editReply({ embeds: [helpEmbed], components: [buttons] });
            }
            }
      },
};