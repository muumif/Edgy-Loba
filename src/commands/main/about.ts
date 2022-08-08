import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Api } from "@top-gg/sdk";
import { embed } from "../../components/embeds";
import { profilePic, linksField } from "../../components/const";
import { client } from "../../index";

const topAPIInstance = new Api(process.env.TOPGG_TOKEN);

module.exports = {
      data: new SlashCommandBuilder()
            .setName("about")
            .setDescription("Everything about the bot!"),

      async execute(interaction: CommandInteraction) {
            const topGGData = await topAPIInstance.getBot("719542118955090011");

            const aboutEmbed = new embed().defaultEmbed()
                  .setTitle("About")
                  .setThumbnail(profilePic(512))
                  .setDescription("This bot was created to give Apex Legends players their stats in an easy and convenient way inside of Discord.\n\n At first the bot was just developed for fun in a private server but now it is being actively worked on for everyone to use. \n\nAll of the data comes from https://apexlegendsstatus.com a great project definitely check them out as well. Thanks Hugo :)")
                  .addFields(
                        {
                              name: "Statistics",
                              value: `
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
                        linksField("Links", false),
                  );

            return await interaction.editReply({ embeds: [aboutEmbed] });

      },
};