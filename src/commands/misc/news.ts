import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { embed } from "../../components/embeds";
import axios from "axios";
import { BitlyData, NewsData } from "../../types/als";
import { logger } from "../../components/logger";
import { filename } from "../../components/const";

async function shortenUrl(link:string) {
      const URI = `${process.env.BITLY_ENDPOINT}/v4/shorten`;
      const shortURL = await (await axios.post(encodeURI(URI), { "long_url": link }, { headers:{ "Authorization": `Bearer ${process.env.BITLY_TOKEN}` } })).data as BitlyData;
      return shortURL.link;
}

module.exports = {
      data: new SlashCommandBuilder()
            .setName("news")
            .setDescription("Shows the latest news from EA news feed about Apex Legends."),
      async execute(interaction: CommandInteraction) {
            try {
                  const newsData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/news?auth=${process.env.ALS_TOKEN}`))).data as NewsData[];

                  const linkToShorten = async () => {
                        const newsEmbed = new embed().defaultEmbed()
                              .setTitle("Latest news");

                        for (let i = 0; i < newsData.length; i++) {
                              if (i == 3) {
                                    break;
                              }

                              newsData[i].link = await shortenUrl(newsData[i].link);
                              newsEmbed.addFields({
                                    name: `${i + 1}. ` + newsData[i].title,
                                    value: newsData[i].short_desc + "\n **Read More: " + newsData[i].link + "**",
                                    inline: true,
                              });
                        }
                        await interaction.editReply({ embeds: [newsEmbed] });
                  };

                  await linkToShorten();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                  if (error.response) {
                        logger.error(error, { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) });
                        return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString())] });
                  }
                  if (error) {
                        logger.error(error, { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) });
                        return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("Please try again in a few seconds!").setDescription(error.response.request.res.statusMessage.toString())] });
                  }
            }
      },
};