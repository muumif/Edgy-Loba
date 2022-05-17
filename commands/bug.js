const Discord = require("discord.js");
const { insertNewBug } = require("../database/db");
require("dotenv").config();

/**
 * Make bug report embed
 * @param {Guild} guild The guild object of the server the issue was in
 * @param {String} userID The userID of the bug reporter
 * @param {Array} args Command arguments
 */
async function makeBugEmbed(guild, userID, args) {
	if (args[0] == undefined) {
		const embed = new Discord.MessageEmbed()
			.setTitle("No command given!")
			.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
			.setDescription(">bug **[command] [message]**\n\n**[command]** - The command that the bug happened on without the prefix.\n**[message]** - Describe the bug in detail.")
			.setColor("#e3a600")
			.setTimestamp()
			.setFooter("Error page", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		return embed;
	}
	if (args[1] == undefined) {
		const embed = new Discord.MessageEmbed()
			.setTitle("No message given!")
			.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
			.setDescription(`>bug **[${args[0]}]** **[message]**\n**[message]** - Describe the bug in detail.`)
			.setColor("#e3a600")
			.setTimestamp()
			.setFooter("Error page", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		return embed;
	}
	return await insertNewBug(guild, userID, args[0], args.slice(1).join(" ")).then(res => {
		const embed = new Discord.MessageEmbed()
			.setTitle("Bug report created!")
			.setDescription(args.slice(1).join(" "))
			.setColor("#e3a600")
			.setTimestamp()
			.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
			.setFooter("Bug - muumif", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		return embed;
	});
}

module.exports = {
	makeBugEmbed,
};