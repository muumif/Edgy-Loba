const Discord = require("discord.js");
require("dotenv").config();
const os = require("os");
const { version } = require("../package.json");

async function makeInfoEmbed() {
	const embed = new Discord.MessageEmbed()
		.setTitle("Info")
		.setTimestamp()
		.setDescription("Running on " + os.hostname)
		.addFields(
			{
				name: "Load avg",
				value: os.loadavg(),
				inline: true,
			},
			{
				name: "Used mem",
				value: (Math.round((os.totalmem - ((os.totalmem / (1024 * 1024 * 1024)) - (os.freemem / (1024 * 1024 * 1024)))) * 100)) / 100 + " / " + (Math.round((os.totalmem / (1024 * 1024 * 1024)) * 100)) / 100,
				inline: true,
			},
			{
				name: "Platform",
				value: os.platform,
				inline: true,
			},
		)
		.setColor("#e3a600")
		.setFooter("Version: " + version);
	return embed;
}

module.exports = {
	makeInfoEmbed,
};