import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { readdirSync } from "fs";
import { cwd } from "process";

const commands = [];
const folders = readdirSync(`${cwd()}/prod/commands`);

for (const folder of folders) {
      const files = readdirSync(`${cwd()}/prod/commands/${folder}`).filter(file => file.endsWith(".js"));
      for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const command = require(`${cwd()}/prod/commands/${folder}/${file}`);
            commands.push(command.data.toJSON());
      }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

if (process.env.NODE_ENV == "development") {
      const clientId = "967426810528825368";
      const guildId = "812033742419001355";

      (async () => {
            try {
                  console.log("Testing server command refreshing started!");

                  await rest.put(
                        Routes.applicationGuildCommands(clientId, guildId),
                        { body: commands },
                  );

                  console.log("Testing server command refreshing was successful!");
            }
            catch (error) {
                  console.log(error);
            }
      })();
}

if (process.env.NODE_ENV == "production") {
      const clientId = "719542118955090011";

      (async () => {
            try {
                  console.log("Global command refreshing started!");

                  await rest.put(
                        Routes.applicationCommands(clientId),
                        { body: commands },
                  );

                  console.log("Global command refreshing was successful!");
            }
            catch (error) {
                  console.log(error);
            }
      })();
}