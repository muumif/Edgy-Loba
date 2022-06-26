const { Client, Intents, Collection } = require("discord.js");
const { AutoPoster } = require("topgg-autoposter");
require("dotenv").config();
const { logger } = require("./misc/internal/logger");
const fs = require("node:fs");
const path = require("node:path");
const { insertNewBug, insertNewGuild, deleteGuild } = require("./misc/internal/db");
require("./misc/internal/scheduler")();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));


for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once("ready", () => {
	logger.info("Bot is now online!", { module: "main" });
	if (process.env.NODE_ENV == "production") {
		client.user.setPresence({ activities: [{ name: `${client.guilds.cache.size} servers`, type: "LISTENING" }], status: "online" });
	}
	else {
		client.user.setPresence({ activities: [{ name: "Internal build!" }], status: "dnd" });

	}
});

if (process.env.NODE_ENV == "production") {
	const ap = AutoPoster(process.env.TOPGG_TOKEN, client);

	ap.on("posted", () => {
		logger.info("Posted stats to Top.GG", { module: "main" });
	});

	client.on("guildCreate", guild => {
		insertNewGuild(guild);
	});

	client.on("guildDelete", guild => {
		deleteGuild(guild);
	});
}

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

client.login(process.env.DISCORD_TOKEN);
