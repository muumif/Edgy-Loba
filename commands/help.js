const Discord = require("discord.js");
require("dotenv").config();

async function makeHelpEmbed(args) {
	switch (args) {
	case undefined: {
		const embed = new Discord.MessageEmbed()
			.setTitle("Help")
			.addFields(
				{
					name: "`>help stats`",
					value: "Commands to see stats and commands related to stats.",
					inline: true,
				},
				{
					name: "`>help misc`",
					value: "Commands to see multiple things about Apex Legends.",
					inline: true,
				},
				/*
				{
					name: "`>help settings`",
					value: "TODO",
					inline: false,
				},
				{
					name: "`>help admin`",
					value: "TODO",
					inline: false,
				},
				*/
				{
					name: "Other",
					value: "[Invite Me](https://discord.com/oauth2/authorize?client_id=719542118955090011&scope=bot) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [Github](https://github.com/muumif/Edgy-Loba)",
					inline: false,
				},
			)
			.setColor("#e3a600")
			.setTimestamp()
			.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
			.setFooter("Help - muumif", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");

		return embed;
	}
	case "stats":{
		const embed = new Discord.MessageEmbed()
			.setTitle("Help Stats")
			.addFields(
				{
					name: "`>stats [Apex IGN] [PC | XBOX | PS | Switch]`",
					value: "Shows users stats. Must use origin username steam wont work. If you have a linked account and want to check your own stats there is no need to add [Apex IGN] or platform.",
					inline: false,
				},
				{
					name: "`>link [Apex IGN] [PC | XBOX | PS | Switch]`",
					value: "Link your Discord account to your Apex username. Doing this allows you to see history graphs, collaborate in the leaderboard and much more.",
					inline: false,
				},
				{
					name: "`>unlink`",
					value: "Unlink your discord account from your Apex username.",
					inline: false,
				},
				{
					name: "`>top`",
					value: "Shows the top 10 users in the server.",
					inline: false,
				},
			)
			.setColor("#e3a600")
			.setTimestamp()
			.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")

			.setFooter("Help Stats - muumif", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");

		return embed;
	}

	case "misc":{
		const embed = new Discord.MessageEmbed()
			.setTitle("Help Misc")
			.setColor("#e3a600")
			.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
			.addFields(
				{
					name: "`>crafting`",
					value: "Shows the current items that can be crafted at the Replicator.",
					inline: false,
				},
				{
					name: "`>map`",
					value: "Shows the current and next maps for Battle Royale and Arenas. Also the time remaining until the next map.",
					inline: false,
				},
				{
					name: "`>news`",
					value: "Shows the latest news from EA news feed about Apex Legends.",
					inline: false,
				},
				{
					name: "`>pred | >predator`",
					value: "Shows how much RP/AP is needed to reach Predator on all platforms.",
					inline: false,
				},
				{
					name: "`>status`",
					value: "Shows the EA servers status also the response time.",
					inline: false,
				},
			)
			.setColor("#e3a600")
			.setTimestamp()
			.setFooter("Help Misc - muumif", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");

		return embed;
	}

	case "settings":{
		return;
	}

	case "admin":{
		return;
	}
	}

}


module.exports = {
	makeHelpEmbed,
};