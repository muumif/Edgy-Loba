const { Client, Intents, Collection } = require("discord.js");
const { AutoPoster } = require("topgg-autoposter");
require("dotenv").config();
const { logger } = require("./moduels/logger");
const fs = require("node:fs");
const path = require("node:path");
const { insertNewBug } = require("./database/db");

require("./moduels/historyUpdater")();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
//const ap = AutoPoster(process.env.TOPGG_TOKEN, client);

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

/*
ap.on("posted", () => {
	logger.info("Posted stats to Top.GG", { module: "ap.on" });
});
*/

client.once("ready", () => {
	logger.info("Bot is now online!", { module: "client.once" });
	client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} servers`, type: "LISTENING" }], status: "online" });
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
		logger.info("Sent message!", { command: interaction.commandName, guildID: interaction.guildId, discordID: interaction.user.id });
	}
	catch (error) {
		logger.error(new Error(error), { command: interaction.commandName, guildID: interaction.guildId, discordID: interaction.user.id });
		await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
	}

});

client.on("interactionCreate", async interaction => {
	if (!interaction.isModalSubmit()) return;

	if (interaction.customId === "bugReport") {
		const commandInput = interaction.fields.getTextInputValue("commandInput");
		const messageInput = interaction.fields.getTextInputValue("messageInput");

		await insertNewBug(interaction.guild, interaction.user.id, commandInput, messageInput);
		interaction.reply({ content: "Bug reported!", ephemeral: true });
	}
});


/*
client.on("guildCreate", guild => {
	insertNewGuild(guild);
});

client.on("guildDelete", guild => {
	deleteGuild(guild);
});
*/

client.login(process.env.DISCORD_TOKEN);
