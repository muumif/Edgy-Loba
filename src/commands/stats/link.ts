import axios from "axios";
import { CommandInteraction, SlashCommandBuilder, Snowflake } from "discord.js";
import { filename } from "../../components/const";
import { DBUser } from "../../components/mongo";
import { embed } from "../../components/embeds";
import { logger } from "../../components/logger";
import { IGNToUID } from "../../components/uid";
import { ALSUserData } from "../../types/als";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("link")
            .setDescription("Link your Discord account to your Apex Legends username")
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

            const dbUser = new DBUser(interaction.user);
            if (await dbUser.getUser() == "User not found!") {
                  try {
                        const userUID = await IGNToUID(user, platform(), interaction.guild?.id, interaction.user.id);
                        const userData = await (await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${userUID}&platform=${platform()}`))).data as ALSUserData;

                        await dbUser.addUser({
                              discordId: interaction.user.id,
                              originId: userUID,
                              RP: userData.global.rank.rankScore,
                              platform: platform(),
                              servers: [ interaction.guild?.id as Snowflake],
                              names: {
                                    player: userData.global.name,
                                    discord: `${interaction.user.username}#${interaction.user.discriminator}`,
                              },
                              updatedAt: new Date(),
                        });

                        const linkEmbed = new embed().defaultEmbed()
                              .setTitle("IGN has been successfully linked!")
                              .setDescription(`${interaction.user.username} linked to **${userData.global.name}** using **${platform()}**`);

                        await interaction.editReply({ embeds: [linkEmbed] });

                  }
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  catch (error: any) {
                        if (error.includes("0101")) {
                              logger.error(error, { metadata: { serverId: interaction.guild?.id, discordId: interaction.user.id, platform: platform(), file: filename(__filename) } });
                              await interaction.editReply({ embeds: [new embed().errorEmbed()
                                    .setTitle("User not found!")
                                    .setDescription(error.split("Error")[1].replace(`${"\""}`, "").replace(`${"\""}`, "").replace(`${":"}`, "").replace(`${"\""}`, "").replace(`${"}"}`, "") + "\n**Please use Origin username linked to your account.**\n Steam accounts do not work at this time.\nYou may only use latin characters due to limitation on Apex side."),
                              ] });
                        }
                        else {
                              await interaction.editReply({ embeds: [new embed().errorEmbed()
                                    .setTitle("An error accured!")
                                    .setDescription("An unkown error accured. If this happens more than once report it as a bug."),
                              ] });
                        }
                  }

            }
            else {
                  await interaction.editReply({ embeds: [new embed().errorEmbed()
                        .setTitle("User has already been linked!")
                        .setDescription("Use command `/unlink` to unlink your account!"),
                  ] });
            }
      },
};