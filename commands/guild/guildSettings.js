const Discord = require("discord.js");
const { updateGuildSettings, getGuildSettings } = require("../../database/db");
require("dotenv").config();

async function makeGuildSettingsEmbed(guildID, setting, value, admin) {
	const embed = new Discord.MessageEmbed()
		.setColor("#e3a600")
		.setTimestamp();
	switch (setting) {
	case undefined:{
		if (!admin.hasPermission("ADMINISTRATOR")) {
			embed.setTitle("No permission to use this command!");
			embed.setDescription("This command is reserved for admins.");
			embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}
		return await getGuildSettings(guildID).then(result => {
			embed.setTitle("Settings!");
			embed.addFields(
				{
					name: "Mode Prefrence",
					value: "Value: " + result.settings.modePref,
					inline: false,
				},
				{
					name: "Default Platform",
					value: "Value: " + result.settings.defaultPlatform,
					inline: false,
				},
				{
					name: "News Notify",
					value: "Value: " + result.settings.notifyNews,
					inline: false,
				},
			);
			embed.setFooter("Settings - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		});
	}

	case "mode": {
		setting = "modePref";
		if (!admin.hasPermission("ADMINISTRATOR")) {
			embed.setTitle("No permission to use this command!");
			embed.setDescription("This command is reserved for admins.");
			embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}
		if (value == "BR" || value == "AR") {
			return await updateGuildSettings(guildID, setting, value).then(function() {
				embed.setTitle("Setting changed!");
				embed.setDescription("Setting `" + setting + "` has been changed and saved with value `" + value + "`");
				embed.setFooter("Setting Mode - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
				return embed;
			}).catch(error => {return console.log(error);});
		}
		embed.setTitle("Unknown values given!");
		embed.setDescription("Setting only allows values of `BR` and `AR`. \nFor more info check how to use this command `>help admin`");
		embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		return embed;
	}

	case "platform": {
		setting = "defaultPlatform";
		if (!admin.hasPermission("ADMINISTRATOR")) {
			embed.setTitle("No permission to use this command!");
			embed.setDescription("This command is reserved for admins.");
			embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}
		if (value == "PC" || value == "X1" || value == "PS" || value == "SWITCH") {
			return await updateGuildSettings(guildID, setting, value).then(function() {
				embed.setTitle("Setting changed!");
				embed.setDescription("Setting `" + setting + "` has been changed and saved with value `" + value + "`");
				embed.setFooter("Setting Platform - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
				return embed;
			}).catch(error => {return console.log(error);});
		}
		embed.setTitle("Unknown values given!");
		embed.setDescription("Setting only allows values of `PC`, `X1`, `PS` and `SWITCH`. \nFor more info check how to use this command `>help admin`");
		embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		return embed;
	}

	case "notify": {
		setting = "notifyNews";
		if (!admin.hasPermission("ADMINISTRATOR")) {
			embed.setTitle("No permission to use this command!");
			embed.setDescription("This command is reserved for admins.");
			embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}
		if (value == "true") {
			value = true;
			return await updateGuildSettings(guildID, setting, value).then(function() {
				embed.setTitle("Setting changed!");
				embed.setDescription("Setting `" + setting + "` has been changed and saved with value `" + value + "`");
				embed.setFooter("Setting News Notify - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
				return embed;
			}).catch(error => {return console.log(error);});
		}
		if (value == "false") {
			value = false;
			return await updateGuildSettings(guildID, setting, value).then(function() {
				embed.setTitle("Setting changed!");
				embed.setDescription("Setting `" + setting + "` has been changed and saved with value `" + value + "`");
				embed.setFooter("Setting News Notify - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
				return embed;
			}).catch(error => {return console.log(error);});
		}

		embed.setTitle("Unknown values given!");
		embed.setDescription("Setting only allows values of `PC`, `X1`, `PS` and `SWITCH`. \nFor more info check how to use this command `>help admin`");
		embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		return embed;


	}

	case "role": { // Not in use
		setting = "newsRole";
		if (!admin.hasPermission("ADMINISTRATOR")) {
			embed.setTitle("No permission to use this command!");
			embed.setDescription("This command is reserved for admins.");
			embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}
		return await updateGuildSettings(guildID, setting, value).then(function() {
			embed.setTitle("Setting changed!");
			embed.setDescription("Setting `" + setting + "` has been changed and saved with value `" + value + "`");
			embed.setFooter("Setting News Role - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}).catch(error => {console.log(error);});
	}

	default: {
		if (!admin.hasPermission("ADMINISTRATOR")) {
			embed.setTitle("No permission to use this command!");
			embed.setDescription("This command is reserved for admins.");
			embed.setFooter("Error page - admin", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
			return embed;
		}
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