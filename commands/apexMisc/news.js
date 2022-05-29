const axios = require("axios");
const Discord = require("discord.js");
const { logger } = require("../../moduels/logger");
require("dotenv").config();

async function getData(guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/news?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			logger.info("ALS API fetched news data!", { command: "news", guildID: guildID, discordID: discordID });
			return response;
		}).catch(error => {
			const embed = new Discord.MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				logger.error(new Error(error), { command: "news", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				logger.error(new Error(error), { command: "news", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				logger.error(new Error(error), { command: "news", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "news", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				logger.error(new Error(error), { command: "news", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				logger.error(new Error(error), { command: "news", guildID: guildID, discordID: discordID });

				return Promise.reject(embed);
			case 500:
				embed.setTitle("API Internal error.");
				logger.error(new Error(error), { command: "news", guildID: guildID, discordID: discordID });
				return Promise.reject(embed);
			}
		});
}

async function shortenUrl(link, guildID, discordID) {
	const URI = `${process.env.BITLY_ENDPOINT}/v4/shorten`;
	return await axios.post(encodeURI(URI), { "long_url": link }, { headers:{ "Authorization": `Bearer ${process.env.BITLY_TOKEN}` } })
		.then(result => {
			logger.info("BITLY API fetched URL!", { command: "news", guildID: guildID, discordID: discordID });
			return result;
		});
}

async function makeNewsEmbed(guildID, discordID) {
	return await getData(guildID, discordID).then(async result => {

		const linkToShorten = async _ => {
			const embed = new Discord.MessageEmbed()
				.setTitle("Latest news")
				.setColor("#e3a600")
				.setFooter("Bugs can be reported with >bug", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
				.setTimestamp();

			for (let i = 0; i < result.data.length; i++) {
				if (i == 3) {
					break;
				}

				result.data[i].link = (await shortenUrl(result.data[i].link, guildID, discordID)).data.link;
				embed.addField(`${i + 1}. ` + result.data[i].title, result.data[i].short_desc + "\n **Link: " + result.data[i].link + "**", true);
			}
			return embed;
		};

		return await linkToShorten();
	}).catch(error => {
		return Promise.reject(error);
	});
}

module.exports = {
	makeNewsEmbed,
};