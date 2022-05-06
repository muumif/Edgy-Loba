const axios = require("axios");
const Discord = require("discord.js");
require("dotenv").config();

async function getData() {
	const URI = `${process.env.ALS_ENDPOINT}/news?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			return response;
		}).catch(error => {
			return Promise.reject(error);
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
		const embed = new Discord.MessageEmbed()
			.setTitle("Error")
			.setDescription(error)
			.setColor("#e3a600");
		return Promise.reject(embed);
	});
}

module.exports = {
	makeNewsEmbed,
};