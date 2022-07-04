/**
 * @file Deploys commands globally and to the BOT Testing server.
 * @author muumif
 * @version 1.0.0
*/

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
require("dotenv").config({ path: "../../.env" }); // This path has to be defined because deploy.js is ran only once and initiated by the user
const commands = [];
const commandFiles = fs.readdirSync("../../commands").filter(file => file.endsWith(".js"));


for (const file of commandFiles) {
	const command = require(`../../commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

if (process.env.NODE_ENV == "development") { // If the bot is running in development mode then update BOT Testing server commands
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

if (process.env.NODE_ENV == "production") { // If the bot is running in production mode then update global commands
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

