const axios = require("axios");
const Discord = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { readFile } = require("fs").promises;
require("dotenv").config();

async function getData() {
	const URI = `${process.env.ALS_ENDPOINT}/store?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			return response;
		}).catch(error => {
			const embed = new Discord.MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				return Promise.reject(embed);
			case 500:
				embed.setDescription("API Internal error.");
				return Promise.reject(embed);
			}
		});
}

async function makeStoreEmbed() {
	const canvas = Canvas.createCanvas(1920, 1080);
	const context = canvas.getContext("2d");

	const background = new Canvas.Image();
	background.src = "http://via.placeholder.com/1920x1080";

	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer("image/jpeg"), "store.jpeg");
	return getData().then(result => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Store")
			.attachFiles(attachment)
			.setImage("attachment://store.jpeg")
			.setColor("#e3a600")
			.setFooter("Bugs can be reported with >bug", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
			.setTimestamp();
		return embed;
	}).catch(error => {
		return Promise.reject(error);
	});
}

module.exports = {
	makeStoreEmbed,
};