import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Api } from "@top-gg/sdk";
import { embed } from "../../components/embeds";
import { profilePic } from "../../components/const";
import { client } from "../../index";

const topAPIInstance = new Api(process.env.TOPGG_TOKEN);

module.exports = {
      data: new SlashCommandBuilder()
            .setName("about")
            .setDescription("Everything about the bot!"),

      async execute(interaction: CommandInteraction) {
            const deferedReply = await interaction.deferReply({ fetchReply: true });
            const topGGData = await topAPIInstance.getBot("719542118955090011");

            const aboutEmbed = new embed().defaultEmbed
                  .setTitle("About")
                  .setThumbnail(profilePic(512))
                  .setDescription("This bot was created to give Apex Legends players their stats in an easy and convenient way inside of Discord.\n\n At first the bot was just developed for fun in a private server but now it is being actively worked on for everyone to use. \n\nAll of the data comes from https://apexlegendsstatus.com a great project definitely check them out as well. Thanks Hugo :) \n\nTo see what I have planned for the future of the bot check out the Github issues and milestones to get the latest information!")
                  .addFields(
                        {
                              name: "Statistics",
                              value: `
						Ping: **${deferedReply.createdTimestamp - interaction.createdTimestamp}ms** 
						Servers: **${client.guilds.cache.size}**
						Monthly Votes: **${topGGData.monthlyPoints}**
						Total Votes: **${topGGData.points}**
						`,
                              inline: false,
                        },
                        {
                              name: "Features",
                              value: `
						Latest Feature: **Slash commands (/)**
						Next Planned Feature: **Data caching with Redis**
						`,
                              inline:false,
                        },
                        {
                              name: "Other",
                              value: "[Invite Me](https://discord.com/oauth2/authorize?client_id=719542118955090011&scope=bot) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [Github](https://github.com/muumif/Edgy-Loba)",
                              inline: false,
                        },
                  );

            return await interaction.editReply({ embeds: [aboutEmbed] });

      },
};