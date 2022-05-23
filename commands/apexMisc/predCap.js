const axios = require("axios");
const Discord = require("discord.js");
const { logger } = require("../../moduels/logger");
require("dotenv").config();

async function getData(guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/predator?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			logger.info("Predator API: Succesfully returned data!", { command: "pred", guildID: guildID, discordID: discordID });
			return response;
		}).catch(error => {
			const embed = new Discord.MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });

				return Promise.reject(embed);
			case 500:
				embed.setTitle("API Internal error.");
				logger.error(new Error(error), { command: "pred", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			}
		});
}

async function makePredatorEmbed(guildID, discordID) {
	return await getData(guildID, discordID).then(result => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Predator Cap")
			.addFields(
				{
					name: "Battle Royale",
					value: "PC: **" + result.data.RP.PC.val + " RP**\nPlaystation: **" + result.data.RP.PS4.val + " RP**\nXbox: **" + result.data.RP.X1.val + " RP**\nSwitch: **" + result.data.RP.SWITCH.val + " RP**",
					inline: true,
				},
				{
					name: "Arenas",
					value: "PC: **" + result.data.AP.PC.val + " AP**\nPlaystation: **" + result.data.AP.PS4.val + " AP**\nXbox: **" + result.data.AP.X1.val + " AP**\nSwitch: **" + result.data.AP.SWITCH.val + " AP**",
					inline: true,
				},
			)
			.setThumbnail("https://api.mozambiquehe.re/assets/ranks/apexpredator1.png")
			.setColor("#e3a600")
			.setFooter("Bugs can be reported with >bug", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
			.setTimestamp();
		return embed;
	}).catch(error => {
		return Promise.reject(error);
	});
}

module.exports = {
	makePredatorEmbed,
};