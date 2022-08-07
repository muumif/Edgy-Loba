import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { profilePic, linksField } from "../../components/const";
import { embed } from "../../components/embeds";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("help")
            .setDescription("Show every commands!")
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
                              {
                                    name: "`/about`",
                                    value: "See almost everything about the bot.",
                                    inline: false,
                              },
                              {
                                    name: "`/crafting`",
                                    value: "See the current items that can be crafted at the replicator.",
                                    inline: false,
                              },
                              {
                                    name: "`/map`",
                                    value: "See each map currently in the rotation and the times when they end.",
                                    inline: false,
                              },
                              {
                                    name: "`/news`",
                                    value: "See the latest news from EA news feed about Apex Legends.",
                                    inline: false,
                              },
                              {
                                    name: "`/predator`",
                                    value: "See how much RP/AP is needed to reach Predator on all platforms.",
                                    inline: false,
                              },
                              {
                                    name: "`/status`",
                                    value: "See the EA servers status and the response time.",
                                    inline: false,
                              },
                              {
                                    name: "`/distribution`",
                                    value: "See the rank distribution.",
                                    inline: false,
                              },
                              {
                                    name: "`/next`",
                                    value: "See when a new split or season starts.",
                                    inline: false,
                              },
                              linksField("Links", false),
                        );
                  return await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
            }
            case "help_stats": {
                  const helpEmbed = new embed().defaultEmbed()
                        .setTitle("Help Stats")
                        .setThumbnail(profilePic(512))
                        .addFields(
                              {
                                    name: "`/stats`",
                                    value: "See a given users stats. Must use Origin username.",
                                    inline: false,
                              },
                              {
                                    name:"`/me`",
                                    value: "See your own stats.",
                                    inline: false,
                              },
                              {
                                    name: "`/link`",
                                    value: "Link a Discord account to an Origin user.",
                                    inline: false,
                              },
                              {
                                    name: "`/unlink`",
                                    value: "Unlink a Discord account from an Origin user.",
                                    inline: false,
                              },
                              {
                                    name: "`/top`",
                                    value: "See the top 10 users in the server.",
                                    inline: false,
                              },
                              {
                                    name: "`/gtop`",
                                    value: "See the top 3 global users on the bot.",
                                    inline: false,
                              },
                              linksField("Links", false),
                        );
                  return await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
            }
            }
      },
};