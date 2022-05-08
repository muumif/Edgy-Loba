const axios = require("axios");
const Discord = require("discord.js");
require("dotenv").config();

async function getData() {
	const URI = `${process.env.ALS_ENDPOINT}/news?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			return response;
		}).catch(error => {
			const embed = new Discord.MessageEmbed()
				.setTitle("An error accured")
				.setColor("#e3a600");
			switch (error.response) {
			case 400:
				embed.setDescription("Something went wrong. Try again in a few minutes.");
				return Promise.reject(embed);
			case 403:
				embed.setDescription("Unauthorized / Unknown API key. The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				return Promise.reject(embed);
			case 404:
				embed.setDescription("Player could not be found. If this continues to happen check that you are using your origin username or report the bug with /bug.");
				return Promise.reject(embed);
			case 405:
				embed.setDescription("External API error. Try again in a few seconds.");
				return Promise.reject(embed);
			case 410:
				embed.setDescription("Unknown platform provided. If this continues to happen report it as a bug with /bug");
				return Promise.reject(embed);
			case 429:
				embed.setDescription("API Rate limit reached. Try again in a few seconds.");
				return Promise.reject(embed);
			case 500:
				embed.setDescription("API Internal error.");
				return Promise.reject(embed);
			}
		});
}

async function shortenUrl(link) {
	const URI = `${process.env.BITLY_ENDPOINT}/v4/shorten`;
	return await axios.post(encodeURI(URI), { "long_url": link }, { headers:{ "Authorization": `Bearer ${process.env.BITLY_TOKEN}` } })
		.then(result => {
			return result;
		});
}

async function makeNewsEmbed() {
	return await getData().then(async result => {

		const linkToShorten = async _ => {
			const embed = new Discord.MessageEmbed()
				.setTitle("Latest news")
				.setColor("#e3a600");

			for (let i = 0; i < result.data.length; i++) {
				if (i == 3) {
					break;
				}

				result.data[i].link = (await shortenUrl(result.data[i].link)).data.link;
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