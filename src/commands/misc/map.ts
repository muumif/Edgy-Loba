import { createCanvas, Image } from "@napi-rs/canvas";
import axios from "axios";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { MapData } from "../../types/als";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("map")
            .setDescription("Shows the current and next maps for Battle Royal and Arenas!"),
      async execute(interaction: CommandInteraction) {
            const mapData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/maprotation?version=2&auth=${process.env.ALS_TOKEN}`))).data as MapData;
            const canvas = createCanvas(2000, 800);
            const context = canvas.getContext("2d");
      },
};