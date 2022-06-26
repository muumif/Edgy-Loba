const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
require("dotenv").config();
const { MessageEmbed } = require("discord.js");
const { logger } = require("../misc/internal/logger");

async function shortenUrl(link) {
	const URI = `${process.env.BITLY_ENDPOINT}/v4/shorten`;
	return await axios.post(encodeURI(URI), { "long_url": link }, { headers:{ "Authorization": `Bearer ${process.env.BITLY_TOKEN}` } })
		.then(result => {
			return result;
		});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("news")
		.setDescription("Shows the latest news from EA news feed about Apex Legends."),
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		await interaction.deferReply();

		try {
			const newsData = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/news?auth=${process.env.ALS_TOKEN}`));

			const linkToShorten = async _ => {
				const embed = new MessageEmbed()
					.setTitle("Latest news")
					.setColor("#e3a600")
					.setFooter({
						text: "Latest news",
						iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256",
					})
					.setTimestamp();

				for (let i = 0; i < newsData.data.length; i++) {
					if (i == 3) {
						break;
					}

					newsData.data[i].link = (await shortenUrl(newsData.data[i].link, interaction.guildId, interaction.user.id)).data.link;
					embed.addField(`${i + 1}. ` + newsData.data[i].title, newsData.data[i].short_desc + "\n **Read More: " + newsData.data[i].link + "**", true);
				}
				await interaction.editReply({ embeds: [embed] });
			};

			await linkToShorten();
		}
		catch (error) {
			if (error.response) {
				logger.error(new Error(error), { command: "news", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString()).setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
			if (error) {
				logger.error(new Error(error), { command: "news", guildID: interaction.guildId });
				return await interaction.editReply({ embeds: [new MessageEmbed().setColor("#e3a600").setTitle("An error accrued!").setDescription("Please try again later!").setTimestamp().setFooter({ text: "Error page", iconURL: "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256" })] });
			}
		}
	},
};