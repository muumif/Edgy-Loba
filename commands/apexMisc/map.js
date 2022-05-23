const axios = require("axios");
const Discord = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { logger } = require("../../moduels/logger");
const { readFile, writeFile } = require("fs").promises;
require("dotenv").config();

async function getData(guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/maprotation?version=2&auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			logger.info("Map API: Succesfully returned data!", { command: "map", guildID: guildID, discordID: discordID });
			return response;
		}).catch(error => {
			const embed = new Discord.MessageEmbed()
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

async function makeMapEmbed(guildID, discordID) {
	const canvas = Canvas.createCanvas(2000, 800);
	const context = canvas.getContext("2d");
	const brMap = new Canvas.Image();
	const rankedBrMap = new Canvas.Image();
	const arenasMap = new Canvas.Image();
	const rankedArenasMap = new Canvas.Image();

	return getData(guildID, discordID).then(async result => {
		switch (result.data.battle_royale.current.code) { // Battle royale map setter
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

		switch (result.data.ranked.current.code) { // Ranked Battle royale map setter
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

		switch (result.data.arenas.current.code) { // Arenas map setter
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

		switch (result.data.arenasRanked.current.code) { // Ranked Arenas map setter
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
		context.strokeStyle = "#e3a600";
		context.lineWidth = 30;
		context.strokeRect(0, 0, canvas.width, canvas.height);
		await writeFile("./temp/map.jpeg", canvas.toBuffer("image/jpeg")).then(function() {
			logger.info("FS: Succesfully wrote map image!", { command: "map", guildID: guildID, discordID: discordID });
		});
		const attachment = new Discord.MessageAttachment("./temp/map.jpeg", "map.jpeg");
		const embed = new Discord.MessageEmbed()
			.setTitle("Map Rotation")
			.addFields(
				{
					name: "__Battle Royale__",
					value: `Current map: **${result.data.battle_royale.current.map}**\nNext Map: **${result.data.battle_royale.next.map}**\nRemaining: **${result.data.battle_royale.current.remainingTimer}**`,
					inline: true,
				},
				{
					name: "__Arenas__",
					value: `Current map: **${result.data.arenas.current.map}**\nNext Map: **${result.data.arenas.next.map}**\nRemaining: **${result.data.arenas.current.remainingTimer}**`,
					inline: true,
				},
				{
					name: "__Arenas Ranked__",
					value: `Current map: **${result.data.arenasRanked.current.map}**\nNext Map: **${result.data.arenasRanked.next.map}**\nRemaining: **${result.data.arenasRanked.current.remainingTimer}**`,
					inline: true,
				},
			)
			.attachFiles(attachment)
			.setImage("attachment://map.jpeg")
			.setColor("#e3a600")
			.setFooter("Bugs can be reported with >bug", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
			.setTimestamp();
		return embed;
	}).catch(error => {
		return Promise.reject(error);
	});
}

module.exports = {
	makeMapEmbed,
};