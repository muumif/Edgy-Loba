import { ActivityType, Client, Collection, Command, GatewayIntentBits, InteractionType } from "discord.js";
import { existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import { logger } from "./components/logger";
import { hostname, type, version } from "os";
import { filename, presences } from "./components/const";
import { DBGlobal, DBServer, start_mongo } from "./components/mongo";
import { AutoPoster } from "topgg-autoposter";
import path from "path";
import "./components/scheduler";
import "./components/express";

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const commands: Collection<unknown, Command> = new Collection();
const commandsPath = path.join(__dirname, "commands");

for (const folder of readdirSync(commandsPath)) {
      const files = readdirSync(path.join(commandsPath, folder)).filter(file => file.endsWith(".js"));
      for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const command = require(path.join(commandsPath, folder, file));
            commands.set(command.data.name, command);
      }
}

client.once("ready", async () => {
      logger.info("▬▬ι═══════ﺤ Edgy Loba is now online -═══════ι▬▬", { metadata: { file: filename(__filename) } });
      logger.info(`Hostname: ${hostname} | Environment: ${process.env.NODE_ENV} | Version: ${process.env.npm_package_version} | OS: ${type} ${version}`, { metadata: { file: filename(__filename) } });

      start_mongo().then(() => logger.info("Connected to MongoDB!", { metadata: { file: filename(__filename) } }));

      const GlobalDB = new DBGlobal();
      const [statistics, serverResult] = await Promise.all([
            GlobalDB.statistics(),
            GlobalDB.verifyServers(client),
      ]);

      client.user?.setPresence({ activities: [{ name: presences(statistics).name, type: ActivityType.Playing }], status: "online" });

      checkTemp();
});

if (process.env.NODE_ENV == "production") {
      AutoPoster(process.env.TOPGG_TOKEN, client);

      client.on("guildCreate", async guild => {
            await new DBServer(guild).addServer();
      });

      client.on("guildDelete", async guild => {
            await new DBServer(guild).deleteServer();
      });
}


client.on("interactionCreate", async interaction => {
      if (interaction.type === InteractionType.ApplicationCommand) {
            const command = commands.get(interaction.commandName);

            if (!command) return;

            try {
                  if (interaction.commandName == "bug") {
                        await command.execute(interaction);
                        logger.info(`[${interaction.user.username}] used [/${interaction.commandName}] in [${interaction.guild?.name}].`, { metadata: { command: interaction.commandName, discordId: interaction.user.id, serverId: interaction.guild?.id, file: filename(__filename) } });
                        return;
                  }
                  const dateBefore = new Date().getTime();

                  if (interaction.commandName != "top") await interaction.deferReply();
                  if (interaction.commandName == "top") await interaction.deferReply({ ephemeral: true });

                  await command.execute(interaction);

                  const dateAfter = new Date().getTime();

                  logger.info(`[${interaction.user.username}] used [/${interaction.commandName}] in [${interaction.guild?.name}]. Bot response time: ${dateAfter - dateBefore}ms`, { metadata: { command: interaction.commandName, discordId: interaction.user.id, serverId: interaction.guild?.id, file: filename(__filename), responseTime: dateAfter - dateBefore } });
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error:any) {
                  logger.error(error, { metadata: { file: filename(__filename) } });
                  await interaction.editReply({ content: "There was an error while executing this command!\nIf this happens more than once, please report it as a bug!" });
            }
      }

      if (interaction.type == InteractionType.ModalSubmit) {
            if (interaction.customId === "bugReport") {
                  const commandInput = interaction.fields.getTextInputValue("commandInput");
                  const messageInput = interaction.fields.getTextInputValue("messageInput");

                  await new DBGlobal().addBug(interaction.user.id, interaction.guildId as string, commandInput, messageInput);
                  await interaction.reply({ content: "Bug reported!", ephemeral: true });
            }
      }
});

function checkTemp() {
      if (!existsSync("./temp")) {
            mkdirSync("./temp");
            logger.info("Made temp directory!", { metadata: { file: filename(__filename) } });
      }
      else {
            const files = readdirSync("./temp");
            for (const file of files) {
                  rmSync("./temp/" + file);
                  logger.info("Cleared temp folder!", { metadata: { file: filename(__filename) } });
            }
      }
}

client.login(process.env.DISCORD_TOKEN);