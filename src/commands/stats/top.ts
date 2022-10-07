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
import { DBServer } from "../../components/mongo";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { UserDocument } from "../../types/mongo";
import { createClient } from "redis";
import { setTimeout } from "node:timers/promises";

const redisClient = createClient({ url: process.env.REDIS_CONNECTION });
redisClient.on("error", (err) => logger.error(err, { metadata: { file: filename(__filename) } }));

module.exports = {
      data: new SlashCommandBuilder()
            .setName("top")
            .setDescription("Shows the server leaderboard!"),
      async execute(interaction: ChatInputCommandInteraction<CacheType>) {
            const buttonTimeout = 30000;
            let topData = await new DBServer(interaction.guild as Guild).getTopUsers() as UserDocument[] | string;
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
                  generatedEmbed.setThumbnail(String((await interaction.client.users.fetch(current[0].discordId)).avatarURL()) ?? "https://cdn.discordapp.com/embed/avatars/2.png");
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

            const collector = embedMessage.createMessageComponentCollector({
                  filter: ({ user }) => user.id === interaction.user.id,
                  time: buttonTimeout,
            });

            collector.on("collect", async interaction => {
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