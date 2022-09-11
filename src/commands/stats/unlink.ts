import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DBUser } from "../../components/mongo";
import { embed } from "../../components/embeds";

module.exports = {
      data: new SlashCommandBuilder()
            .setName("unlink")
            .setDescription("Unlink your discord account from your Apex username."),
      async execute(interaction: CommandInteraction) {

            const dbUser = new DBUser(interaction.user.id);
            if (await dbUser.getUser() == "User not found!") {
                  const unlinkEmbed = new embed().errorEmbed()
                        .setTitle("You don't have any linked usernames!")
                        .setDescription("You can link your username: `/link`");
                  await interaction.editReply({ embeds: [unlinkEmbed] });
            }
            else {
                  await dbUser.deleteUser();
                  const unlinkEmbed = new embed().defaultEmbed()
                        .setTitle("Username has been successfully unlinked!");
                  await interaction.editReply({ embeds: [unlinkEmbed] });
            }

      },
};