import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embed } from "../../components/embeds";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("help")
            .setDescription("Show all commands!")
            .addStringOption(option =>
                  option
                        .setName("category")
                        .setDescription("The help category!")
                        .setRequired(true)
                        .addChoices(
                              { name: "misc", value: "help_misc" },
                              { name: "stats", value: "help_stats" },
                              /*{ name: "admin", value: "help_admin" },*/
                        )),
      async execute(interaction: CommandInteraction) {

            const chosenString = interaction.options.getString("category");
            switch (chosenString) {
            case "help_misc": { // Multiple pages for /help
                  const helpEmbed = new embed().defaultEmbed
                        .setTitle("Help Misc")
                        .addFields(
                              {
                                    name: "`/crafting`",
                                    value: "Shows the current items that can be crafted at the replicator.",
                                    inline: false,
                              },
                              {
                                    name: "`/map`",
                                    value: "Shows the current and next maps for Battle Royal and Arenas. Also the time remaining until the next map.",
                                    inline: false,
                              },
                              {
                                    name: "`/news`",
                                    value: "Shows the latest news from EA news feed about Apex Legends.",
                                    inline: false,
                              },
                              {
                                    name: "`/predator`",
                                    value: "Shows how much RP/AP is needed to reach Predator on all platforms.",
                                    inline: false,
                              },
                              {
                                    name: "`/status`",
                                    value: "Shows the EA servers status and the response time.",
                                    inline: false,
                              },
                              {
                                    name: "`/about`",
                                    value: "Almost everything about the bot!",
                                    inline: false,
                              },
                              {
                                    name: "`/distribution`",
                                    value: "Shows the rank distribution.",
                                    inline: false,
                              },
                              {
                                    name: "`/next`",
                                    value: "Shows when a new split or season starts.",
                                    inline: false,
                              },
                              {
                                    name: "Other",
                                    value: "[Invite Me](https://discord.com/api/oauth2/authorize?client_id=719542118955090011&permissions=0&scope=bot%20applications.commands) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [Github](https://github.com/muumif/Edgy-Loba)",
                                    inline: false,
                              },
                        );
                  return await interaction.editReply({ embeds: [helpEmbed], ephemeral: true });
            }


            case "help_stats": {
                  const helpEmbed = new MessageEmbed()
                        .setTitle("Help Stats")
                        .addFields(
                              {
                                    name: "`/stats`",
                                    value: "Shows users stats. Must use Origin username Steam wont work.",
                                    inline: false,
                              },
                              {
                                    name: "`/link`",
                                    value: "Link your Discord account to your Origin username. Doing this allows you to see history graphs, collaborate in the leaderboard and much more.",
                                    inline: false,
                              },
                              {
                                    name: "`/unlink`",
                                    value: "Unlink your discord account from your Origin username.",
                                    inline: false,
                              },
                              {
                                    name: "`/top`",
                                    value: "Shows the top 10 users in the server.",
                                    inline: false,
                              },
                              {
                                    name: "`/gtop`",
                                    value: "Shows the top 3 global users on the bot.",
                                    inline: false,
                              },
                              {
                                    name: "Other",
                                    value: "[Invite Me](https://discord.com/api/oauth2/authorize?client_id=719542118955090011&permissions=0&scope=bot%20applications.commands) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [Github](https://github.com/muumif/Edgy-Loba)",
                                    inline: false,
                              },
                        )
                        .setColor("#e3a600")
                        .setTimestamp()
                        .setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
                        .setFooter({
                              text: "Help Stats - muumif",
                              iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
                        });
                  return await interaction.editReply({ embeds: [helpEmbed], ephemeral: true });
            }

            }
      },
};