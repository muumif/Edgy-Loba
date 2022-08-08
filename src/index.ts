import { ActivityType, Client, Collection, Command, GatewayIntentBits, InteractionType } from "discord.js";
import { readdirSync, existsSync, mkdir } from "fs";
import path from "path";
import { logger } from "./components/logger";
import { hostname, type, version } from "os";
import { filename } from "./components/const";

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

const tempFolder = path.join(__dirname, "temp");
if (!existsSync(tempFolder)) {
      logger.info("Temp directory doesn't exist!", { file: filename(__filename) });
      mkdir(tempFolder, error => {
            if (error) return logger.error(error);
            logger.info("Made temp directory!", { file: filename(__filename) });
      });
}

client.once("ready", () => {
      logger.info("▬▬ι═══════ﺤ Edgy Loba is now online -═══════ι▬▬", { file: filename(__filename) });
      logger.info(`Hostname: ${hostname} | Environment: ${process.env.NODE_ENV} | Version: ${process.env.npm_package_version} | OS: ${type} ${version}`, { file: filename(__filename) });
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
                  const deferredReply = await interaction.deferReply({ fetchReply: true });
                  await command.execute(interaction);
                  logger.info(`[${interaction.user.username}] used [/${interaction.commandName}] in [${interaction.guild?.name}]. Bot response time: ${deferredReply.createdTimestamp - interaction.createdTimestamp}ms`, { discordId: interaction.user.id, serverId: interaction.guild?.id, file: filename(__filename), responseTime: deferredReply.createdTimestamp - interaction.createdTimestamp });
            }
            catch (error) {
                  //TODO: Make a seperate error handeler in components
                  await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
      }
});

client.login(process.env.DISCORD_TOKEN);