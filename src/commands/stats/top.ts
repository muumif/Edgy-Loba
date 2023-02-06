import {
      ActionRowBuilder,
      ButtonBuilder,
      ButtonStyle,
      CacheType,
      ChatInputCommandInteraction,
      Guild,
      SlashCommandBuilder,
} from "discord.js";
import { filename, profilePic } from "../../components/const";
import { DBServer, DBUser } from "../../components/mongo";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { UserDocument } from "../../types/mongo";
import { setTimeout } from "node:timers/promises";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("top")
            .setDescription("Shows the server leaderboard"),
      async execute(interaction: ChatInputCommandInteraction<CacheType>) {
            const buttonTimeout = 30000;

            if (!await new DBUser(interaction.user).hasFeatureAccess()) {
                  const voteButton = new ButtonBuilder()
                        .setLabel("Vote")
                        .setURL("https://top.gg/bot/719542118955090011/vote")
                        .setStyle(ButtonStyle.Link);
                  const topEmbed = new embed().errorEmbed()
                        .setTitle("No vote detected!")
                        .setDescription("To use this command you need to have voted!\n\nThis is done to get the bot self running, so that the developer doesn't need to intervene as much.");
                  return await interaction.editReply({ embeds: [topEmbed], components: [new ActionRowBuilder<ButtonBuilder>({ components: [voteButton] })] });
            }

            const dbServer = new DBServer(interaction.guild as Guild);
            let topData = await dbServer.getTopUsers() as UserDocument[] | string;
            if (topData == "No user data!") {
                  const topEmbed = new embed().errorEmbed()
                        .setTitle("An error accrued!")
                        .setDescription("No users exist in this server!");
                  return await interaction.editReply({ embeds: [topEmbed] });
            }
            topData = topData as UserDocument[];

            const backButton = new ButtonBuilder()
                  .setStyle(ButtonStyle.Danger)
                  .setLabel("⬅ Back")
                  .setCustomId("back");

            const nextButton = new ButtonBuilder()
                  .setStyle(ButtonStyle.Success)
                  .setLabel("Next ➡")
                  .setCustomId("next");

            let currentIndex = 0;
            const generateEmbed = async (start: number) => {
                  const current = topData.slice(start, start + 10) as UserDocument[];
                  topData = topData as UserDocument[];
                  const generatedEmbed = new embed().defaultEmbed()
                        .setTitle(`${interaction.guild?.name} leaderboard!`)
                        .setDescription(`Showing users **${start + 1}-${start + current.length}** out of **${topData.length}**`);

                  const pageCount = () => {
                        if (topData.length <= 10) {
                              return 1;
                        }
                        return Math.round(topData.length / 10);
                  };

                  generatedEmbed.setFooter({ text: `Page ${(currentIndex / 10) + 1} / ${pageCount()}`, iconURL: profilePic(128) });
                  const avatar = (await interaction.client.users.fetch(topData[0].discordId)).avatarURL();
                  if (avatar == null) {
                        generatedEmbed.setThumbnail("https://cdn.discordapp.com/embed/avatars/2.png");
                  }
                  else {
                        generatedEmbed.setThumbnail(avatar);
                  }
                  for (let i = 0; i < current.length; i++) {
                        if (interaction.user.id == current[i].discordId) {
                              generatedEmbed.addFields({
                                    name: `__${start + i + 1}. ${current[i].names.player} | ${current[i].names.discord}__`,
                                    value: `RP: ${current[i].RP}`,
                                    inline: false,
                              });
                        }
                        else {
                              generatedEmbed.addFields({
                                    name: `${start + i + 1}. ${current[i].names.player} | ${current[i].names.discord}`,
                                    value: `RP: ${current[i].RP}`,
                                    inline: false,
                              });
                        }
                  }

                  return generatedEmbed;
            };

            const canFitOnePage = topData.length <= 10;
            const embedMessage = await interaction.editReply({ embeds: [await generateEmbed(0)], components: canFitOnePage ? [] : [new ActionRowBuilder<ButtonBuilder>({ components: [nextButton] })] });
            if (canFitOnePage) return;

            const userId = interaction.user.id;
            const collector = embedMessage.createMessageComponentCollector({
                  filter: ({ user }) => user.id === userId,
                  time: buttonTimeout,
            });

            collector.on("collect", async (interaction: any) => { // Not good using any
                  interaction.customId === "back" ? (currentIndex -= 10) : (currentIndex += 10);
                  const dateBefore = new Date().getTime();
                  await interaction.update({ embeds: [await generateEmbed(currentIndex)], components: [new ActionRowBuilder<ButtonBuilder>({ components: [...(currentIndex ? [backButton] : []), ...(currentIndex + 10 < topData.length ? [nextButton] : [])] })] });
                  const dateAfter = new Date().getTime();
                  logger.info(`[${interaction.user.username}] used [/top] button for page [${(currentIndex / 10) + 1}] in [${interaction.guild?.name}]. Bot response time: ${dateAfter - dateBefore}ms`, { metadata: { file: filename(__filename), responseTime: dateAfter - dateBefore } });
                  await setTimeout(buttonTimeout);
                  await interaction.editReply({ embeds: [await generateEmbed(currentIndex)], components: [new ActionRowBuilder<ButtonBuilder>({ components: [...(currentIndex ? [backButton.setDisabled(true)] : []), ...(currentIndex + 10 < topData.length ? [nextButton.setDisabled(true)] : [])] })] });
            });
      },
};