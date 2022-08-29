import axios from "axios";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { filename } from "../../components/const";
import { DBUser } from "../../components/database";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { getUserUID } from "../../components/uid";
import { ALSUserData } from "../../types/als";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("link")
            .setDescription("Link your Discord account to your Apex Legends username.")
            .addStringOption(option => {
                  option
                        .setName("username")
                        .setDescription("The username for user! PC users must use Origin name!")
                        .setRequired(true);
                  return option;
            })
            .addStringOption(option => {
                  option
                        .setName("platform")
                        .setDescription("The platform for user!")
                        .setRequired(true)
                        .addChoices(
                              { name: "PC", value: "link_pc" },
                              { name: "Xbox", value: "link_x1" },
                              { name: "Playstation", value: "link_ps" },
                        );
                  return option;
            }),
      async execute(interaction: CommandInteraction) {
            const user = interaction.options.get("username")?.value as string;
            const platform = () => {
                  switch (interaction.options.get("platform")?.value) {
                  case "link_pc":
                        return "PC";
                  case "link_x1":
                        return "X1";
                  case "link_ps":
                        return "PS4";
                  default:
                        return "PC";
                  }
            };

            const dbUser = new DBUser(interaction.user.id);
            if (await dbUser.getUser() == "User not found!") {
                  try {
                        const userUID = await getUserUID(user, platform(), interaction.guild?.id, interaction.user.id);
                        const userData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${userUID}&platform=${platform()}`))).data as ALSUserData;

                        await dbUser.addUser(userUID, userData.global.rank.rankScore, userData.global.arena.rankScore, platform(), interaction.guild?.id);

                        const linkEmbed = new embed().defaultEmbed()
                              .setTitle("IGN has been successfully linked!")
                              .setDescription(`${interaction.user.username} linked to **${userData.global.name}** using **${platform()}**`);

                        await interaction.editReply({ embeds: [linkEmbed] });

                  }
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  catch (error: any) {
                        if (error.isGetUidError) {
                              logger.error(error, { metadata: { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) } });
                              return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("An error accrued!").setDescription(error.message)] });
                        }
                        if (error.response) {
                              logger.error(error, { metadata: { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) } });
                              return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("An error accrued!").setDescription(error.response.request.res.statusMessage.toString())] });
                        }
                        if (error) {
                              logger.error(error, { metadata: { discordId: interaction.user.id, serverId: interaction.guildId, file: filename(__filename) } });
                              return await interaction.editReply({ embeds: [new embed().errorEmbed().setTitle("Please try again in a few seconds!").setDescription(error.response.request.res.statusMessage.toString())] });
                        }
                  }

            }
            else {
                  const linkEmbed = new embed().errorEmbed()
                        .setTitle("User is already been linked!")
                        .setDescription("Use command `/unlink` to unlink your account!");
                  await interaction.editReply({ embeds: [linkEmbed] });
            }
      },
};