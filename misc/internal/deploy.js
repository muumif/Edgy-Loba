const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const { logger } = require("./logger");

const commands = [];
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

const clientId = "967426810528825368";

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
		logger.info("Global command refreshing started!", { module: "deploy" });

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		logger.info("Global command refreshing was successful!", { module: "deploy" });
	}
	catch (error) {
		logger.error(new Error(error), { module: "deploy" });
	}
})();