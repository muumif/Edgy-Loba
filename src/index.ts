import { ActivityType, Client, Collection, Command, GatewayIntentBits, InteractionType } from "discord.js";
import { readdirSync } from "fs";
import path from "path";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands: Collection<unknown, Command> = new Collection();
const commandsPath = path.join(__dirname, "commands");

for (const folder of readdirSync(commandsPath)) {
      const files = readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith(".js"));
      for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const command = require(path.join(commandsPath, folder, file));
            commands.set(command.data.name, command);
      }
}

client.once("ready", () => {
      console.log("Edgy-Loba has started under ENV: " + process.env.NODE_ENV);
      if (process.env.NODE_ENV == "production") {
            client.user?.setPresence({ activities: [{ name: `${client.guilds.cache.size} servers!`, type: ActivityType.Listening }], status: "online" });
      }
      else {
            client.user?.setPresence({ activities: [{ name: "Internal build!" }], status: "dnd" });
      }
});

client.on("interactionCreate", async interaction => {
      if (interaction.type === InteractionType.ApplicationCommand) {
            const command = commands.get(interaction.commandName);

            if (!command) return;

            try {
                  await command.execute(interaction);
                  //TODO: Log when command is sent
            }
            catch (error) {
                  //TODO: Make a seperate error handeler in components
                  await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
      }
});

client.login(process.env.DISCORD_TOKEN);