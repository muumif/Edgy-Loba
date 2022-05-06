const axios = require("axios");
const Discord = require("discord.js");
require("dotenv").config();

async function getData() {
	const URI = `${process.env.ALS_ENDPOINT}/predator?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			return response;
		}).catch(error => {
			return Promise.reject(error);
		});
}

async function makePredatorEmbed() {
	return await getData().then(result => {
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
			.setColor("#e3a600");
		return embed;
	}).catch(error => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error")
			.setDescription(error.response.data)
			.setColor("#e3a600");
		return Promise.reject(embed);
	});
}

module.exports = {
	makePredatorEmbed,
};