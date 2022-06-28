const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
require("dotenv").config({ path: "../../.env" });
const { logger } = require("./logger");

const commands = [];
const commandFiles = fs.readdirSync("../../commands").filter(file => file.endsWith(".js"));


for (const file of commandFiles) {
	const command = require(`../../commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

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

