const { SlashCommandBuilder } = require("@discordjs/builders");
require("dotenv").config();
const axios = require("axios");
const { MessageEmbed } = require("discord.js");
const sharp = require("sharp");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Show all commands!")
		.addStringOption(option =>
			option.setName("category")
				.setDescription("The help category!")
				.setRequired(true)
				.addChoices(
					{ name: "misc", value: "help_misc" },
					{ name: "stats", value: "help_stats" },
					{ name: "admin", value: "help_admin" },
				)),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const chosenString = interaction.options.getString("category");
		switch (chosenString) {
		case "help_misc": {
			const embed = new MessageEmbed()
				.setTitle("Help Misc")
				.setColor("#e3a600")
				.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
				.addFields(
					{
						name: "`/crafting`",
						value: "Shows the current items that can be crafted at the replicator.",
						inline: false,
					},
					{
						name: "`/map`",
						value: "Shows the current and next maps for Battle Royale and Arenas. Also the time remaining until the next map.",
						inline: false,
					},
					{
						name: "`/news`",
						value: "Shows the latest news from EA news feed about Apex Legends.",
						inline: false,
					},
					{
						name: "`/pred`",
						value: "Shows how much RP/AP is needed to reach Predator on all platforms.",
						inline: false,
					},
					{
						name: "`/status`",
						value: "Shows the EA servers status also the response time.",
						inline: false,
					},
					{
						name: "Other",
						value: "[Invite Me](https://discord.com/oauth2/authorize?client_id=719542118955090011&scope=bot) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [Github](https://github.com/muumif/Edgy-Loba)",
						inline: false,
					},
				)
				.setColor("#e3a600")
				.setTimestamp()
				.setFooter({
					text: "Help Misc - muumif",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				});
			interaction.reply({ embeds: [embed], ephemeral: true });
			break;
		}


		case "help_stats": {
			const embed = new MessageEmbed()
				.setTitle("Help Stats")
				.addFields(
					{
						name: "`/stats [Apex IGN] [PC | XBOX | PS | Switch]`",
						value: "Shows users stats. Must use origin username steam wont work. If you have a linked account and want to check your own stats there is no need to add [Apex IGN] or platform.",
						inline: false,
					},
					{
						name: "`/link [Apex IGN] [PC | XBOX | PS | Switch]`",
						value: "Link your Discord account to your Apex username. Doing this allows you to see history graphs, collaborate in the leaderboard and much more.",
						inline: false,
					},
					{
						name: "`/unlink`",
						value: "Unlink your discord account from your Apex username.",
						inline: false,
					},
					{
						name: "`/top`",
						value: "Shows the top 10 users in the server.",
						inline: false,
					},
					{
						name: "`/gtop`",
						value: "Shows the top 3 global users on the bot.",
						inline: false,
					},
					{
						name: "Other",
						value: "[Invite Me](https://discord.com/oauth2/authorize?client_id=719542118955090011&scope=bot) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [Github](https://github.com/muumif/Edgy-Loba)",
						inline: false,
					},
				)
				.setColor("#e3a600")
				.setTimestamp()
				.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
				.setFooter({
					text: "Help Stats - muumif",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				});
			interaction.reply({ embeds: [embed], ephemeral: true });
			break;
		}

		case "help_admin": {
			const embed = new MessageEmbed()
				.setTitle("Help Admin")
				.setDescription("These commands are not fully implemented and might not work at times!")
				.setColor("#e3a600")
				.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
				.addFields(
					{
						name: "`/settings`",
						value: "See all the settings that are set.",
						inline: false,
					},
					{
						name: "`/settings [Mode] [BR | AR]`",
						value: "Set the default gamemode that will be used in top and other commands.\n`BR - Battle Royale`\n`AR - Arenas`",
						inline: false,
					},
					{
						name: "`/settings [Default] [PC | X1 | PS | SWITCH]`",
						value: "Set the default platform so that when checking stats you wont need to enter platform if the user exists on that platform.\n`PC - PC`\n`X1 - Xbox`\n`PS - Playstation`\n`SWITCH - Nintendo Switch`",
						inline: false,
					},
					{
						name: "Other",
						value: "[Invite Me](https://discord.com/oauth2/authorize?client_id=719542118955090011&scope=bot) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [Github](https://github.com/muumif/Edgy-Loba)",
						inline: false,
					},
				)
				.setColor("#e3a600")
				.setTimestamp()
				.setFooter({
					text: "Help Admin - muumif",
					iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
				});
			interaction.reply({ embeds: [embed], ephemeral: true });
			break;
		}
		}
	},
};