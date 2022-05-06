const axios = require("axios");
const Discord = require("discord.js");
require("dotenv").config();

async function getData() {
	const URI = `${process.env.ALS_ENDPOINT}/crafting?auth=${process.env.ALS_TOKEN}`;
	return await axios.get(encodeURI(URI))
		.then(function(response) {
			return response;
		}).catch(error => {
			return Promise.reject(error);
		});
}

async function makeCraftingEmbed() {
	return await getData().then(result => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Crafting Rotation")
			.addFields(
				{
					name: "Daily",
					value: "",
					inline: true,
				},
			)
			.setColor("#e3a600");
		return embed;
		//TODO: THIS
	}).catch(error => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Error")
			.setDescription(error.response.data)
			.setColor("#e3a600");
		return Promise.reject(embed);
	});
}

module.exports = {
	makeCraftingEmbed,
};