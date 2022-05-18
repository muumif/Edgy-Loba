const Discord = require("discord.js");
const { updateGuildSettings } = require("../../database/db");
require("dotenv").config();

async function makeGuildSettingsEmbed(guildID, setting, value) {
	const embed = new Discord.MessageEmbed()
		//.setTitle("Server Settings")
		.setColor("#e3a600")
		.setTimestamp();
		//.setFooter("Top 10", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
	switch (setting) {
	case undefined:{
		embed.setTitle("No arguments given!");
		embed.setDescription("Use `>help admin` to check how to use this command!");
		embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		return embed;
	}

	case "mode": {
		setting = "modePref";
		if (value != "BR") {
			embed.setTitle("Unknown values given!");
			embed.setDescription("Setting only allows values of BR and AR. \nFor more info check how to use this command `>help admin`");
			embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}

		return await updateGuildSettings(guildID, setting, value).then(function() {
			embed.setTitle("Setting changed!");
			embed.setDescription(`Setting ${setting} has been changed and saved with value ${value}!`);
			embed.setFooter("Setting Mode - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}).catch(error => {console.log(error);});

	}

	case "platform": {
		setting = "defaultPlatform";
		return await updateGuildSettings(guildID, setting, value).then(function() {
			embed.setTitle("Setting changed!");
			embed.setDescription(`Setting ${setting} has been changed and saved with value ${value}!`);
			embed.setFooter("Setting Platform - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}).catch(error => {console.log(error);});
	}

	case "notify": {
		setting = "notifyNews";
		return await updateGuildSettings(guildID, setting, value).then(function() {
			embed.setTitle("Setting changed!");
			embed.setDescription(`Setting ${setting} has been changed and saved with value ${value}!`);
			embed.setFooter("Setting News Notify - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}).catch(error => {console.log(error);});

	}

	case "role": {
		setting = "newsRole";
		return await updateGuildSettings(guildID, setting, value).then(function() {
			embed.setTitle("Setting changed!");
			embed.setDescription(`Setting ${setting} has been changed and saved with value ${value}!`);
			embed.setFooter("Setting News Role - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}).catch(error => {console.log(error);});
	}

	default: {
		embed.setTitle("Wrong arguments given!");
		embed.setDescription("Use `>help admin` to check how to use this command!");
		embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		return embed;
	}
	}
}

module.exports = {
	makeGuildSettingsEmbed,
};