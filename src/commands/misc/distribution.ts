import { AttachmentBuilder, CommandInteraction, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { filename } from "../../components/const";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { DistributionData } from "../../types/als";
import { makeDistributionChart } from "../../components/charts";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("distribution")
            .setDescription("Shows the rank distribution."),
      async execute(interaction: CommandInteraction) {

            try {
                  const distData = await (await axios.get(encodeURI("https://apexlegendsstatus.com/lib/php/rankdistrib.php?unranked=yes"))).data as DistributionData[];
                  const distribEmbed = new embed().defaultEmbed()
                        .setTitle("Rank Distribution")
                        .setDescription("Data from https://apexlegendsstatus.com\nThis data is from all the user that exist in the ALS database.");

                  const allCount = () => {
                        let count = 0;
                        for (let i = 1; i < distData.length; i++) {
                              count += Number(distData[i].totalCount);
                        }
                        return count;
                  };

                  for (let i = 1; i < distData.length; i++) {
                        distribEmbed.addFields({
                              name: distData[i].name,
                              value: `${"```ansi\n\u001b[0;33m"}${((Number(distData[i].totalCount) / allCount() * 100).toFixed(2)).toString()}\u001b[0;37m%${"```"}`,
                              inline: true,
                        });
                  }

                  const fileName = await makeDistributionChart(distData);
                  const distribFile = new AttachmentBuilder(`${fileName}`);
                  distribEmbed.setImage(`attachment://${filename(fileName)}`);

                  await interaction.editReply({ embeds: [distribEmbed], files: [distribFile] });
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