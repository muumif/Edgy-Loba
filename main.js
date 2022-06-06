const { Client, Intents, Collection } = require("discord.js");
const { AutoPoster } = require("topgg-autoposter");
require("dotenv").config();
const { logger } = require("./moduels/logger");
const fs = require("node:fs");
const path = require("node:path");
const { insertNewBug } = require("./database/db");

require("./moduels/historyUpdater")();

/*
const { makeMapEmbed } = require("./commands/apexMisc/map");
const { makeStatusEmbed } = require("./commands/apexMisc/status");
const { makeNewsEmbed } = require("./commands/apexMisc/news");
const { makePredatorEmbed } = require("./commands/apexMisc/predCap");
const { makeCraftingEmbed } = require("./commands/apexMisc/crafting");
const { makeStoreEmbed } = require("./commands/apexMisc/store");

const { makeTopEmbed } = require("./commands/userStats/localTop");
const { makeStatsEmbed } = require("./commands/userStats/stats");
const { makeLinkEmbed } = require("./commands/userStats/link");
const { makeUnlinkEmbed } = require("./commands/userStats/unlink");

const { makeGuildSettingsEmbed } = require("./commands/guild/guildSettings");

const { makeHelpEmbed } = require("./commands/help");
const { makeInfoEmbed } = require("./commands/info");
const { makeBugEmbed } = require("./commands/bug");

const { insertNewGuild, deleteGuild } = require("./database/db");
const { makeGTopEmbed } = require("./commands/userStats/globalTop");
*/

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const prefix = process.env.PREFIX;
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
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
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

/*
client.on("message", async message => {

	if (message.author.bot) return;
	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "help") {

		makeHelpEmbed(args[0]).then(result => {
			logger.info("Message sent successfully!", { command: "help", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		});
	}
	if (command === "info") {

		makeInfoEmbed().then(result => {
			logger.info("Message sent successfully!", { command: "info", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		});
	}

	if (command === "link") {

		makeLinkEmbed(args[0], args[1], message.guild.id, message.author.id, message.author).then(result => {
			logger.info("Message sent successfully!", { command: "link", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "link", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "unlink") {

		makeUnlinkEmbed(message.author.id).then(result => {
			logger.info("Message sent successfully!", { command: "unlink", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "unlink", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "stats") {

		makeStatsEmbed(args[0], args[1], message.author.id, message.guild.id).then(result => {
			logger.info("Message sent successfully!", { command: "stats", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "stats", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "top") {

		makeTopEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Message sent successfully!", { command: "top", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch((error) => {
			logger.error(new Error(error), { command: "top", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "gtop" || command === "global") {

		await makeGTopEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Message sent successfully!", { command: "gtop", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch((error) => {
			logger.error(new Error(error), { command: "gtop", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "map") {

		makeMapEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Message sent successfully!", { command: "map", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "map", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "status") {

		makeStatusEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Message sent successfully!", { command: "status", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "status", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "pred" || command === "predator") {

		makePredatorEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Message sent successfully!", { command: "pred", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "pred", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command == "crafting") {

		makeCraftingEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Message sent successfully!", { command: "crafting", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "crafting", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "news") {

		makeNewsEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Message sent successfully!", { command: "news", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "news", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
 	}

	if (command === "store") {

		makeStoreEmbed().then(result => {
			logger.info("Message sent successfully!", { command: "store", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "store", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "bug") {

		makeBugEmbed(message.guild, message.author.id, args).then(result => {
			logger.info("Message sent successfully!", { command: "bug", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "bug", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
	}

	if (command === "settings") {

		makeGuildSettingsEmbed(message.guild.id, args[0], args[1], message.member, message.author.id).then(result => {
			logger.info("Message sent successfully!", { command: "settings", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.error(new Error(error), { command: "settings", guildID: message.guild.id, discordID: message.author.id });
			console.log(error);
		});
	}
});
*/
client.login(process.env.DISCORD_TOKEN);
