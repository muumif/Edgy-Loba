/**
 * @file Bot /about command.
 * @author muumif
 * @version 1.0.0
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { Api } = require("@top-gg/sdk");
const topApiInstance = new Api(process.env.TOPGG_TOKEN);
require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("about")
		.setDescription("Everything about the bot!"),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const sent = await interaction.deferReply({ fetchReply: true });

		const topData = await topApiInstance.getBot("719542118955090011");

		const embed = new MessageEmbed()
			.setTitle("About")
			.setColor("#e3a600")
			.setTimestamp()
			.setFooter({ text: "About - muumif", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })
			.setThumbnail("https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256")
			.setDescription("This bot was created to give Apex Legends players their stats in an easy and convenient way inside of Discord.\n\n At first the bot was just developed for fun in a private server but now it is being actively worked on for everyone to use. \n\nAll of the data comes from https://apexlegendsstatus.com a great project definitely check them out as well. Thanks Hugo :) \n\nTo see what I have planned for the future of the bot check out the Github issues and milestones to get the latest information!")
			.addFields(
				{
					name: "Statistics",
					value: `
						Ping: **${sent.createdTimestamp - interaction.createdTimestamp}ms** 
						Servers: **${topData.server_count}**
						Monthly Votes: **${topData.monthlyPoints}**
						Total Votes: **${topData.points}**
						`,
					inline: false,
				},
				{
					name: "Features",
					value: `
						Latest Feature: **Slash commands (/)**
						Next Planned Feature: **Data caching with Redis**
						`,
					inline:false,
				},
				{
					name: "Other",
					value: "[Invite Me](https://discord.com/oauth2/authorize?client_id=719542118955090011&scope=bot) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [Github](https://github.com/muumif/Edgy-Loba)",
					inline: false,
				},
			);


		return await interaction.editReply({ embeds: [embed] });

	},
};