import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { filename } from "../../components/const";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import axios from "axios";
import { StatusData } from "../../types/als";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("status")
            .setDescription("Shows the EA servers status and the response time."),
      async execute(interaction: CommandInteraction) {
            try {
                  const statusData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/servers?auth=${process.env.ALS_TOKEN}`))).data as StatusData;
                  const statusEmbed = new embed().defaultEmbed()
                        .setTitle("Server Status")
                        .setDescription("Data from https://apexlegendsstatus.com")
                        .addFields(
                              {
                                    name: ":flag_eu: EU-West",
                                    value: "Status: " + statusData.EA_novafusion["EU-West"].Status + "\nPing: " + statusData.EA_novafusion["EU-West"].ResponseTime,
                                    inline: true,
                              },
                              {
                                    name: ":flag_eu: EU-East",
                                    value: "Status: " + statusData.EA_novafusion["EU-East"].Status + "\nPing: " + statusData.EA_novafusion["EU-East"].ResponseTime,
                                    inline: true,
                              },
                              {
                                    name: ":flag_us: US-West",
                                    value: "Status: " + statusData.EA_novafusion["US-West"].Status + "\nPing: " + statusData.EA_novafusion["US-West"].ResponseTime,
                                    inline: true,
                              },
                              {
                                    name: ":flag_us: US-Central",
                                    value: "Status: " + statusData.EA_novafusion["US-Central"].Status + "\nPing: " + statusData.EA_novafusion["US-Central"].ResponseTime,
                                    inline: true,
                              },
                              {
                                    name: ":flag_us: US-East",
                                    value: "Status: " + statusData.EA_novafusion["EU-East"].Status + "\nPing: " + statusData.EA_novafusion["EU-East"].ResponseTime,
                                    inline: true,
                              },
                              {
                                    name: ":flag_br: South America",
                                    value: "Status: " + statusData.EA_novafusion.SouthAmerica.Status + "\nPing: " + statusData.EA_novafusion.SouthAmerica.ResponseTime,
                                    inline: true,
                              },
                              {
                                    name: ":flag_jp: Asia",
                                    value:"Status: " + statusData.EA_novafusion.Asia.Status + "\nPing: " + statusData.EA_novafusion.Asia.ResponseTime,
                                    inline: true,
                              },
                        );
                  return await interaction.editReply({ embeds: [statusEmbed] });
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