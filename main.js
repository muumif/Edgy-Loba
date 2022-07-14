/**
 * @file The main file for all entry points/commands/monitoring.
 * @author muumif
 * @version 1.0.0
*/

const { Client, Intents, Collection } = require("discord.js");
const { AutoPoster } = require("topgg-autoposter");
const { logger } = require("./misc/internal/logger");
const { readdirSync, existsSync, mkdir } = require("fs");
const { insertNewBug, insertNewGuild, deleteGuild } = require("./misc/internal/db");
const path = require("path");
require("./misc/internal/scheduler")();
require("dotenv").config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Collection();

const commandFolders = readdirSync("./commands");

for (const folder of commandFolders) {
	const files = readdirSync(`./commands/${folder}`).filter(file => file.endsWith(".js"));
	for (const file of files) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.data.name, command);
	}
}

if (!existsSync(path.join(__dirname, "temp"))) {
	mkdir(path.join(__dirname, "temp"), (err) => {
		if (err) {
			logger.error(new Error(err), { module: "main" });
		}
		logger.info("Made temp directory!", { module: "main" });
	});
}

client.once("ready", () => {
	logger.info("Bot is now online!", { module: "main" });
	if (process.env.NODE_ENV == "production") {
		client.user.setPresence({ activities: [{ name: `to ${client.guilds.cache.size}`, type: "LISTENING" }], status: "online" });
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
	if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
			logger.info("Sent message!", { command: interaction.commandName, guildID: interaction.guildId, discordID: interaction.user.id });
		}
		catch (error) {
			logger.error(error, { command: interaction.commandName, guildID: interaction.guildId, discordID: interaction.user.id });
			await interaction.editReply({ content: "There was an error while executing this command!", ephemeral: true });
		}
	}
	if (interaction.isModalSubmit()) {
		if (interaction.customId === "bugReport") {
			const commandInput = interaction.fields.getTextInputValue("commandInput");
			const messageInput = interaction.fields.getTextInputValue("messageInput");

			await insertNewBug(interaction.guild, interaction.user.id, commandInput, messageInput);
			interaction.reply({ content: "Bug reported!", ephemeral: true });
		}
	}

});

client.login(process.env.DISCORD_TOKEN);
