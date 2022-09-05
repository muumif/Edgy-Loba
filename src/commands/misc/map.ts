import { createCanvas, Image } from "@napi-rs/canvas";
import axios from "axios";
import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { readFileSync, writeFile } from "fs";
import { MapData } from "../../types/als";
import { embed } from "../../components/embeds";
import { filename } from "../../components/const";
import { logger } from "../../components/logger";
import { cwd } from "process";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("map")
            .setDescription("Shows the current and next maps for Battle Royal and Arenas!"),
      async execute(interaction: CommandInteraction) {
            try {
                  const mapData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/maprotation?version=2&auth=${process.env.ALS_TOKEN}`))).data as MapData;

                  const [canvasWidth, canvasHeight] = [1920, 680];
                  const [BRMap, rankedBRMap, arenasMap, rankedArenasMap ] = [new Image(), new Image(), new Image(), new Image()];

                  const canvas = createCanvas(canvasWidth, canvasHeight);
                  const context = canvas.getContext("2d");

                  BRMap.src = readFileSync(`${cwd()}/images/maps/${mapData.battle_royale.current.code}.jpg`);
                  rankedBRMap.src = readFileSync(`${cwd()}/images/maps/${mapData.ranked.current.code}.jpg`);
                  arenasMap.src = readFileSync(`${cwd()}/images/maps/${mapData.arenas.current.code}.jpg`);
                  rankedArenasMap.src = readFileSync(`${cwd()}/images/maps/${mapData.arenasRanked.current.code}.jpg`);

                  // Draw map images to the canvas
                  context.drawImage(BRMap, 0, 0, BRMap.width, BRMap.height, 0, 0, canvasWidth, canvasHeight);
                  context.drawImage(rankedBRMap, 480, 0, rankedBRMap.width, rankedBRMap.height, 480, 0, canvasWidth, canvasHeight);
                  context.drawImage(arenasMap, 960, 0, arenasMap.width, arenasMap.height, 960, 0, canvasWidth, canvasHeight);
                  context.drawImage(rankedArenasMap, 1440, 0, rankedArenasMap.width, rankedArenasMap.height, 1440, 0, canvasWidth, canvasHeight);

                  // Draw a half transparent black box over the whole canvas
                  context.fillStyle = "rgba(0,0,0,0.25)";
                  context.fillRect(0, 0, canvasWidth, canvasHeight);

                  // Draw lines between the images on the canvas
                  context.strokeStyle = "rgb(222, 160, 0)";
                  context.lineWidth = 2;
                  for (let i = 0, startPos = 480; i < 3; i++) {
                        context.beginPath();
                        context.moveTo(startPos, 0);
                        context.lineTo(startPos, canvasHeight);
                        context.stroke();
                        startPos = startPos + 480;
                  }

                  const currentTime = new Date().getTime();
                  writeFile(`./temp/map_${currentTime}.jpeg`, canvas.toBuffer("image/jpeg"), error => {
                        if (error) throw error;
                        logger.info(`Made temp file: map_${currentTime}.png`, { metadata: { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) } });
                  });

                  const mapFile = new AttachmentBuilder(`./temp/map_${currentTime}.jpeg`);
                  const mapEmbed = new embed().defaultEmbed()
                        .setTitle("Map Rotation")
                        .addFields(
                              {
                                    name: "Battle Royale",
                                    value: `${"```ansi"}\n\u001b[0;37mCurrent: \u001b[0;33m${mapData.battle_royale.current.map}\n\u001b[0;37mNext: \u001b[0;33m${mapData.battle_royale.next.map}\n\u001b[0;37mRemaining: \u001b[0;33m${mapData.battle_royale.current.remainingTimer}${"```"}`,
                                    inline: true,
                              },
                              {
                                    name: "Arenas",
                                    value: `${"```ansi"}\n\u001b[0;37mCurrent: \u001b[0;33m${mapData.arenas.current.map}\n\u001b[0;37mNext: \u001b[0;33m${mapData.arenas.next.map}\n\u001b[0;37mRemaining: \u001b[0;33m${mapData.arenas.current.remainingTimer}${"```"}`,
                                    inline: true,
                              },
                              {
                                    name: "Ranked Arenas",
                                    value: `${"```ansi"}\n\u001b[0;37mCurrent: \u001b[0;33m${mapData.arenasRanked.current.map}\n\u001b[0;37mNext: \u001b[0;33m${mapData.arenasRanked.next.map}\n\u001b[0;37mRemaining: \u001b[0;33m${mapData.arenasRanked.current.remainingTimer}${"```"}`,
                                    inline: true,
                              },
                              {
                                    name: "Ranked",
                                    value: `${"```ansi"}\n\u001b[0;37mCurrent: \u001b[0;33m${mapData.ranked.current.map}\n\u001b[0;37mNext: \u001b[0;33m${mapData.ranked.next.map}${"```"}`,
                                    inline: true,
                              },
                        )
                        .setImage(`attachment://${filename(`./temp/map_${currentTime}.jpeg`)}`);

                  await interaction.editReply({ embeds: [mapEmbed], files: [mapFile] });

            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                  if (error.response) {
                        logger.error(error, { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) });
                        return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString())] });
                  }
                  if (error) {
                        logger.error(error, { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) });
                        return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("Please try again in a few seconds!").setDescription(error.response.request.res.statusMessage.toString())] });
                  }
            }

      },
};