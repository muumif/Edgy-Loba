const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const { logger } = require("../moduels/logger");

async function getData(guildID, discordID) {
	const URI = `${process.env.ALS_ENDPOINT}/news?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			logger.info("API fetched news data!", { command: "news", guildID: guildID, discordID: discordID });
			return response;
		}).catch(error => {
			const embed = new MessageEmbed()
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
			return result;
		});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("news")
		.setDescription("Shows the latest news from EA news feed about Apex Legends."),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		interaction.deferReply();

		const newsData = await getData(interaction.guildId, interaction.user.id);

		const linkToShorten = async _ => {
			const embed = new MessageEmbed()
				.setTitle("Latest news")
				.setColor("#e3a600")
				.setFooter({
					text: "Help Misc - muumif",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				})
				.setTimestamp();

			for (let i = 0; i < newsData.data.length; i++) {
				if (i == 3) {
					break;
				}

				newsData.data[i].link = (await shortenUrl(newsData.data[i].link, interaction.guildId, interaction.user.id)).data.link;
				embed.addField(`${i + 1}. ` + newsData.data[i].title, newsData.data[i].short_desc + "\n **Link: " + newsData.data[i].link + "**", true);
			}
			interaction.editReply({ embeds: [embed] });
		};

		linkToShorten();
	},
};