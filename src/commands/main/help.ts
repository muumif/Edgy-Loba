import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { linksButtons, profilePic } from "../../components/const";
import { embed } from "../../components/embeds";
import { getCommands } from "../../components/const";

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
            const chosenString = interaction.options.get("category")?.value;
            switch (chosenString) {
            case "help_misc": {
                  const helpEmbed = new embed().defaultEmbed()
                        .setTitle("Help Miscellaneous")
                        .setThumbnail(profilePic(512))
                        .addFields(
                              getCommands("misc"),
                        );
                  return await interaction.editReply({ embeds: [helpEmbed], components: [linksButtons] });
            }
            case "help_stats": {
                  const helpEmbed = new embed().defaultEmbed()
                        .setTitle("Help Stats")
                        .setThumbnail(profilePic(512))
                        .addFields(
                              getCommands("stats"),
                        );
                  await interaction.editReply({ embeds: [helpEmbed], components: [linksButtons] });
            }
            }
      },
};