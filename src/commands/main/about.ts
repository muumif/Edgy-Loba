import { CommandInteraction, SlashCommandBuilder, User } from "discord.js";
import { Api } from "@top-gg/sdk";
import { embed } from "../../components/embeds";
import { filename, linksButtons, profilePic } from "../../components/const";
import moment from "moment";
import { DBGlobal } from "../../components/mongo";
import { logger } from "../../components/logger";

const topAPIInstance = new Api(process.env.TOPGG_TOKEN);

module.exports = {
      data: new SlashCommandBuilder()
            .setName("about")
            .setDescription("Shows statistics about the bot"),
      async execute(interaction: CommandInteraction) {
            try {
                  const [statistics, topGGData] = await Promise.all([new DBGlobal().statistics(), topAPIInstance.getBot("719542118955090011")]);
                  await interaction.client.application?.fetch();
                  const author = interaction.client.application?.owner as User;
                  const uptime = moment.duration(Number(interaction.client.uptime));

                  const aboutEmbed = new embed().defaultEmbed()
                        .setAuthor({
                              name: `${author.username}#${author.discriminator}`,
                              url: "https://github.com/muumif/",
                              iconURL: author.avatarURL()?.toString(),
                        })
                        .setDescription("This bot was created to give Apex Legends players their stats in an easy and convenient way inside of Discord.\n\n At first the bot was just developed for fun in a private server but now it is being actively worked on for everyone to use. \n\nAll of the data comes from https://apexlegendsstatus.com a great project definitely check them out as well. Thanks Hugo :)\n\n⠀")
                        .setThumbnail(profilePic(512))
                        .addFields(
                              {
                                    name: "Host",
                                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                                    value: `nNode ${process.version}\nDiscord v${require("discord.js").version}`,
                                    inline: true,
                              },
                              {
                                    name: "Database",
                                    value: `${statistics.userCount} users\n${statistics.historyCount} history data points\n${statistics.logCount} logs saved\n${statistics.serverCount} servers`,
                                    inline: true,
                              },
                              {
                                    name: "Votes",
                                    value: `${topGGData.monthlyPoints} monthly\n${topGGData.points} total`,
                                    inline: true,
                              },
                              {
                                    name: "Servers",
                                    value: `${interaction.client.guilds.cache.size}`,
                                    inline:true,
                              },

                              {
                                    name: "Channels",
                                    value: `${interaction.client.channels.cache.size} total`,
                                    inline: true,
                              },
                              {
                                    name: "Uptime",
                                    value: `${uptime.hours()}h ${uptime.minutes()}m ${uptime.seconds()}s`,
                                    inline: true,
                              },
                        )
                        .setFooter({ text: `Running on version ${process.env.npm_package_version}`, iconURL: profilePic(128) });

                  await interaction.editReply({ embeds: [aboutEmbed], components: [linksButtons] });
            }
            catch (error: any) {
                  logger.error(error, {metadata: {file: filename(__filename)}});
                  await interaction.editReply({ content: "Something went wrong!" });
            }
      },
};