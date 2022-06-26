const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
require("dotenv").config();
const { MessageEmbed, MessageAttachment } = require("discord.js");
const { logger } = require("../misc/internal/logger");
const { readFile, writeFile } = require("fs").promises;
const Canvas = require("@napi-rs/canvas");

async function getData(guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/maprotation?version=2&auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			logger.info("ALS API fetched map data!", { command: "map", guildID: guildID, discordID: discordID });
			return response;
		}).catch(error => {
			const embed = new MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				logger.error(new Error(error), { command: "map", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				logger.error(new Error(error), { command: "map", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				logger.error(new Error(error), { command: "map", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "map", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				logger.error(new Error(error), { command: "map", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "map", guildID: guildID, discordID: discordID });

				return Promise.reject(embed);
			case 500:
				embed.setTitle("API Internal error.");
				logger.error(new Error(error), { command: "map", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			}
		});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("map")
		.setDescription("Shows the current and next maps for Battle Royal and Arenas!"),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		const mapData = await getData(interaction.guildId, interaction.user.id);
		const canvas = Canvas.createCanvas(2000, 800);
		const context = canvas.getContext("2d");
		const brMap = new Canvas.Image();
		const rankedBrMap = new Canvas.Image();
		const arenasMap = new Canvas.Image();
		const rankedArenasMap = new Canvas.Image();

		switch (mapData.data.battle_royale.current.code) { // Battle Royal map setter
		case "olympus_rotation": {
			const brMapFile = await readFile("./images/maps/Olympus.jpg");
			brMap.src = brMapFile;
			break;
		}

		case "worlds_edge_rotation": {
			const brMapFile = await readFile("./images/maps/Worlds_Edge.jpg");
			brMap.src = brMapFile;
			break;
		}

		case "kings_canyon_rotation": {
			const brMapFile = await readFile("./images/maps/Kings_Canyon.jpg");
			brMap.src = brMapFile;
			break;
		}

		case "storm_point_rotation": {
			const brMapFile = await readFile("./images/maps/Storm_Point.jpg");
			brMap.src = brMapFile;
			break;
		}
		}

		switch (mapData.data.ranked.current.code) { // Ranked Battle Royal map setter
		case "olympus_rotation": {
			const brMapFile = await readFile("./images/maps/Olympus.jpg");
			rankedBrMap.src = brMapFile;
			break;
		}

		case "worlds_edge_rotation": {
			const brMapFile = await readFile("./images/maps/Worlds_Edge.jpg");
			rankedBrMap.src = brMapFile;
			break;
		}

		case "kings_canyon_rotation": {
			const brMapFile = await readFile("./images/maps/Kings_Canyon.jpg");
			rankedBrMap.src = brMapFile;
			break;
		}

		case "storm_point_rotation": {
			const brMapFile = await readFile("./images/maps/Storm_Point.jpg");
			rankedBrMap.src = brMapFile;
			break;
		}
		}

		switch (mapData.data.arenas.current.code) { // Arenas map setter
		case "arenas_artillery" :{
			const arenasMapFile = await readFile("./images/maps/Arena_Artillery.jpg");
			arenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_encore": {
			const arenasMapFile = await readFile("./images/maps/Arena_Encore.jpg");
			arenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_golden_gardens": {
			const arenasMapFile = await readFile("./images/maps/Arena_Golden_Gardens.jpg");
			arenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_overflow": {
			const arenasMapFile = await readFile("./images/maps/Arena_Overflow.jpg");
			arenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_party_crasher": {
			const arenasMapFile = await readFile("./images/maps/Arena_Party_Crasher.jpg");
			arenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_phase_runner": {
			const arenasMapFile = await readFile("./images/maps/Arena_Phase_Runner.jpg");
			arenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_thermal_station": {
			const arenasMapFile = await readFile("./images/maps/Arena_Thermal_Station.jpg");
			arenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_composite": {
			const arenasMapFile = await readFile("./images/maps/Arena_Drop_Off.jpg");
			arenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_habitat": {
			const arenasMapFile = await readFile("./images/maps/Arena_Habitat.jpg");
			arenasMap.src = arenasMapFile;
			break;
		}
		}

		switch (mapData.data.arenasRanked.current.code) { // Ranked Arenas map setter
		case "arenas_artillery" :{
			const arenasMapFile = await readFile("./images/maps/Arena_Artillery.jpg");
			rankedArenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_encore": {
			const arenasMapFile = await readFile("./images/maps/Arena_Encore.jpg");
			rankedArenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_golden_gardens": {
			const arenasMapFile = await readFile("./images/maps/Arena_Golden_Gardens.jpg");
			rankedArenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_overflow": {
			const arenasMapFile = await readFile("./images/maps/Arena_Overflow.jpg");
			rankedArenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_party_crasher": {
			const arenasMapFile = await readFile("./images/maps/Arena_Party_Crasher.jpg");
			rankedArenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_phase_runner": {
			const arenasMapFile = await readFile("./images/maps/Arena_Phase_Runner.jpg");
			rankedArenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_thermal_station": {
			const arenasMapFile = await readFile("./images/maps/Arena_Thermal_Station.jpg");
			rankedArenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_composite": {
			const arenasMapFile = await readFile("./images/maps/Arena_Drop_Off.jpg");
			rankedArenasMap.src = arenasMapFile;
			break;
		}

		case "arenas_habitat": {
			const arenasMapFile = await readFile("./images/maps/Arena_Habitat.jpg");
			rankedArenasMap.src = arenasMapFile;
			break;
		}
		}

		context.drawImage(brMap, 900, 0, brMap.width, brMap.height, 0, 0, canvas.width, canvas.height);
		context.drawImage(arenasMap, 900, 0, arenasMap.width, arenasMap.height, canvas.width / 3, 0, canvas.width, canvas.height);
		context.drawImage(rankedArenasMap, 900, 0, rankedArenasMap.width, rankedArenasMap.height, (canvas.width / 3) * 2, 0, canvas.width, canvas.height);
		context.fillStyle = "rgba(0, 0, 0, 0.25)";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.strokeStyle = "#e3a600";
		context.lineWidth = 30;
		context.strokeRect(0, 0, canvas.width, canvas.height);


		await writeFile("./temp/map.jpeg", canvas.toBuffer("image/jpeg")).then(function() {
			logger.info("Map image written to disk!", { command: "map", guildID: interaction.guildId, discordID: interaction.user.id });
		});

		const attachment = new MessageAttachment("./temp/map.jpeg", "map.jpeg");
		const embed = new MessageEmbed()
			.setTitle("Map Rotation")
			.addFields(
				{
					name: "__Battle Royal__",
					value: `Current map: **${mapData.data.battle_royale.current.map}**\nNext Map: **${mapData.data.battle_royale.next.map}**\nRemaining: **${mapData.data.battle_royale.current.remainingTimer}**`,
					inline: true,
				},
				{
					name: "__Arenas__",
					value: `Current map: **${mapData.data.arenas.current.map}**\nNext Map: **${mapData.data.arenas.next.map}**\nRemaining: **${mapData.data.arenas.current.remainingTimer}**`,
					inline: true,
				},
				{
					name: "__Arenas Ranked__",
					value: `Current map: **${mapData.data.arenasRanked.current.map}**\nNext Map: **${mapData.data.arenasRanked.next.map}**\nRemaining: **${mapData.data.arenasRanked.current.remainingTimer}**`,
					inline: true,
				},
			)
			.setColor("#e3a600")
			.setImage("attachment://map.jpeg")
			.setFooter({ text: "Bugs can be reported with /bug", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
			.setTimestamp();
		return await interaction.editReply({ embeds: [embed], files:[attachment] });
	},
};