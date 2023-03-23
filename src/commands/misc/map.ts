import { createCanvas, Image } from "@napi-rs/canvas";
import axios from "axios";
import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { readFile, writeFile } from "fs/promises";
import { MapData } from "../../types/als";
import { embed } from "../../components/embeds";
import { filename } from "../../components/const";
import { logger } from "../../components/logger";
import { cwd } from "process";
import { scheduleJob } from "node-schedule";
import { existsSync } from "fs";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("map")
            .setDescription("Shows the current map rotation"),
      async execute(interaction: CommandInteraction) {
            try {
                  const mapData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/maprotation?version=2&auth=${process.env.ALS_TOKEN}`))).data as MapData;

                  const buttonTimeout = 30000;

                  const [canvasWidth, canvasHeight] = [1920, 680];
                  const [BRMap, rankedBRMap, LTMMap ] = [new Image(), new Image(), new Image()];

                  const canvas = createCanvas(canvasWidth, canvasHeight);
                  const context = canvas.getContext("2d");

                  BRMap.src = existsSync(`${cwd()}/images/maps/${mapData.battle_royale.current.code}.jpg`) ? await readFile(`${cwd()}/images/maps/${mapData.battle_royale.current.code}.jpg`) : await readFile(`${cwd()}/images/maps/not_found.jpg`);
                  rankedBRMap.src = existsSync(`${cwd()}/images/maps/${mapData.ranked.current.code}.jpg`) ? await readFile(`${cwd()}/images/maps/${mapData.ranked.current.code}.jpg`) : await readFile(`${cwd()}/images/maps/not_found.jpg`);
                  LTMMap.src = existsSync(`${cwd()}/images/maps/${mapData.ltm.current.code}.jpg`) ? await readFile(`${cwd()}/images/maps/${mapData.ltm.current.code}.jpg`) : await readFile(`${cwd()}/images/maps/not_found.jpg`);

                  // Draw map images to the canvas
                  context.drawImage(BRMap, 0, 0, BRMap.width, BRMap.height, 0, 0, canvasWidth, canvasHeight);
                  context.drawImage(rankedBRMap, 640, 0, rankedBRMap.width, rankedBRMap.height, 640, 0, canvasWidth, canvasHeight);
                  context.drawImage(LTMMap, 1280, 0, LTMMap.width, LTMMap.height, 1280, 0, canvasWidth, canvasHeight);

                  // Draw a half transparent black box over the whole canvas
                  context.fillStyle = "rgba(0,0,0,0.25)";
                  context.fillRect(0, 0, canvasWidth, canvasHeight);

                  // Draw lines between the images on the canvas
                  context.strokeStyle = "rgb(222, 160, 0)";
                  context.lineWidth = 2;
                  for (let i = 0, startPos = 640; i < 3; i++) {
                        context.beginPath();
                        context.moveTo(startPos, 0);
                        context.lineTo(startPos, canvasHeight);
                        context.stroke();
                        startPos = startPos + 640;
                  }

                  const currentTime = new Date().getTime();
                  await writeFile(`./temp/map_${currentTime}.jpeg`, canvas.toBuffer("image/jpeg"));
                  const mapFile = new AttachmentBuilder(`./temp/map_${currentTime}.jpeg`);

                  const mapButtons = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                              new ButtonBuilder()
                                    .setLabel("Remind next BR")
                                    .setCustomId("remindNextBR")
                                    .setStyle(ButtonStyle.Primary),
                              new ButtonBuilder()
                                    .setLabel("Remind next ranked")
                                    .setCustomId("remindNextRanked")
                                    .setStyle(ButtonStyle.Primary),
                              new ButtonBuilder()
                                    .setLabel("Remind next LTM")
                                    .setCustomId("remindNextLTM")
                                    .setStyle(ButtonStyle.Primary),
                        );

                  const mapEmbed = new embed().defaultEmbed()
                        .setTitle("Map Rotation")
                        .addFields(
                              {
                                    name: "Battle Royale",
                                    value: `**Current:**\n${mapData.battle_royale.current.map}\n**Next:**\n${mapData.battle_royale.next.map}\n**Remaining:**\n<t:${mapData.battle_royale.next.start}:R>`,
                                    inline: true,
                              },
                              {
                                    name: "Ranked",
                                    value: `**Current:**\n${mapData.ranked.current.map}\n**Next:**\n${mapData.ranked.next.map}\n**Remaining:**\n<t:${mapData.ranked.next.start}:R>`,
                                    inline: true,
                              },
                              {
                                    name: "LTM: " + mapData.ltm.current.eventName,
                                    value: `**Current:**\n${mapData.ltm.current.map}\n**Next:**\n${mapData.ltm.next.map}\n**Remaining:**\n<t:${mapData.ltm.next.start}:R>`,
                                    inline: true,
                              },
                        )
                        .setImage(`attachment://${filename(`./temp/map_${currentTime}.jpeg`)}`);

                  const embedMessage = await interaction.editReply({ embeds: [mapEmbed], files: [mapFile], components: [mapButtons] });

                  const userId = interaction.user.id;
                  const collector = embedMessage.createMessageComponentCollector({
                        filter: ({ user }) => user.id === userId,
                        time: buttonTimeout,
                  });
                  collector.on("collect", async (interaction) => {
                        if (interaction.customId == "remindNextBR") {
                              const reminderEmbed = new embed().defaultEmbed()
                                    .setTitle("Reminder BR");
                              reminderEmbed.setDescription(`The next map starts <t:${mapData.battle_royale.next.start}:R>.\nThe next map is **${mapData.battle_royale.next.map}**.\nCurrent map is **${mapData.battle_royale.current.map}**.`);
                              const nextDate = new Date(mapData.battle_royale.next.start * 1000);
                              scheduleJob(nextDate, async () => {
                                    await interaction.user.send(`**${mapData.battle_royale.next.map}** has started now!`);
                                    logger.info(`User [${interaction.user.username}] was reminded for the next BR map.`, { metadata: { discordId: interaction.user.id, serverId: interaction.guild?.id, file: filename(__filename) } });
                              });
                              await interaction.user.send({ embeds: [reminderEmbed] });
                              await interaction.reply({ content: "You will be reminded when the next BR map starts!", ephemeral: true });
                              logger.info(`User [${interaction.user.username}] set a reminder for the next BR map.`, { metadata: { discordId: interaction.user.id, serverId: interaction.guild?.id, file: filename(__filename) } });
                        }
                        if (interaction.customId == "remindNextRanked") {
                              const reminderEmbed = new embed().defaultEmbed()
                                    .setTitle("Reminder Ranked");
                              reminderEmbed.setDescription(`The next map starts <t:${mapData.ranked.next.start}:R>.\nThe next map is **${mapData.ranked.next.map}**.\nCurrent map is **${mapData.ranked.current.map}**.`);
                              const nextDate = new Date(mapData.ranked.next.start * 1000);
                              scheduleJob(nextDate, async () => {
                                    await interaction.user.send(`**${mapData.ranked.next.map}** has started now!`);
                                    logger.info(`User [${interaction.user.username}] was reminded for the next ranked map.`, { metadata: { discordId: interaction.user.id, serverId: interaction.guild?.id, file: filename(__filename) } });
                              });
                              await interaction.user.send({ embeds: [reminderEmbed] });
                              await interaction.reply({ content: "You will be reminded when the next ranked map starts!", ephemeral: true });
                              logger.info(`User [${interaction.user.username}] set a reminder for the next ranked map.`, { metadata: { discordId: interaction.user.id, serverId: interaction.guild?.id, file: filename(__filename) } });
                        }
                        if (interaction.customId == "remindNextLTM") {
                              const reminderEmbed = new embed().defaultEmbed()
                                    .setTitle("Reminder LTM");
                              reminderEmbed.setDescription(`The next map starts <t:${mapData.ltm.next.start}:R>.\nThe next map is **${mapData.ltm.next.map}**.\nCurrent map is **${mapData.ltm.current.map}**.`);
                              const nextDate = new Date(mapData.ltm.next.start * 1000);
                              scheduleJob(nextDate, async () => {
                                    await interaction.user.send(`**${mapData.ltm.next.map}** has started now!`);
                                    logger.info(`User [${interaction.user.username}] was reminded for the next LTM map.`, { metadata: { discordId: interaction.user.id, serverId: interaction.guild?.id, file: filename(__filename) } });
                              });
                              await interaction.user.send({ embeds: [reminderEmbed] });
                              await interaction.reply({ content: "You will be reminded when the next LTM map starts!", ephemeral: true });
                              logger.info(`User [${interaction.user.username}] set a reminder for the next LTM map.`, { metadata: { discordId: interaction.user.id, serverId: interaction.guild?.id, file: filename(__filename) } });
                        }
                  });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                  console.log(error);
                  if (error.response) {
                        logger.error(error, { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) });
                        await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString())] });
                  } else {
                        logger.error(error, { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) });
                        await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("Please try again in a few seconds!").setDescription(error)] });
                  }
            }

      },
};