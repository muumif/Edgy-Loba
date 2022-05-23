const Discord = require("discord.js");
require("dotenv").config();

const { makeMapEmbed } = require("./commands/apexMisc/map");
const { makeStatusEmbed } = require("./commands/apexMisc/status");
const { makeNewsEmbed } = require("./commands/apexMisc/news");
const { makePredatorEmbed } = require("./commands/apexMisc/predCap");
const { makeCraftingEmbed } = require("./commands/apexMisc/crafting");

const { makeTopEmbed } = require("./commands/userStats/localTop");
const { makeStatsEmbed } = require("./commands/userStats/stats");
const { makeLinkEmbed } = require("./commands/userStats/link");
const { makeUnlinkEmbed } = require("./commands/userStats/unlink");

const { makeHelpEmbed } = require("./commands/help");
const { makeInfoEmbed } = require("./commands/info");

const { insertNewGuild, deleteGuild } = require("./database/db");
const { makeBugEmbed } = require("./commands/bug");
const { makeStoreEmbed } = require("./commands/apexMisc/store");
const { makeGuildSettingsEmbed } = require("./commands/guild/guildSettings");
const { logger } = require("./moduels/logger");

require("./moduels/historyUpdater")();

const client = new Discord.Client();
const prefix = process.env.PREFIX;

client.once("ready", () => {
	console.log("Online!");
	client.user.setPresence({ activity: { name: ">help", type: "LISTENING" }, status: "online" });
});

client.on("guildCreate", guild => {
	insertNewGuild(guild);
});

client.on("guildDelete", guild => {
	deleteGuild(guild);
});

client.on("message", async message => {

	if (message.author.bot) return;
	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "help") {
		message.channel.startTyping();
		makeHelpEmbed(args[0]).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "help", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		});
		message.channel.stopTyping();
	}

	if (command === "info") {
		message.channel.startTyping();
		makeInfoEmbed().then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "info", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		});
		message.channel.stopTyping();
	}

	if (command === "link") {
		message.channel.startTyping();
		makeLinkEmbed(args[0], args[1], message.guild.id, message.author.id, message.author).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "link", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "link", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "unlink") {
		message.channel.startTyping();
		makeUnlinkEmbed(message.author.id).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "unlink", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "unlink", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "stats") {
		message.channel.startTyping();
		makeStatsEmbed(args[0], args[1], message.author.id, message.guild.id).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "stats", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "stats", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "top") {
		message.channel.startTyping();
		makeTopEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "top", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch((error) => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "top", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "map") {
		message.channel.startTyping();
		makeMapEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "map", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "map", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "status") {
		message.channel.startTyping();
		makeStatusEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "status", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "status", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "pred" || command === "predator") {
		message.channel.startTyping();
		makePredatorEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "pred", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "pred", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command == "crafting") {
		message.channel.startTyping();
		makeCraftingEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "crafting", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "crafting", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "news") {
		message.channel.startTyping();
		makeNewsEmbed(message.guild.id, message.author.id).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "news", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "news", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "store") {
		message.channel.startTyping();
		makeStoreEmbed().then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "store", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "store", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "bug") {
		message.channel.startTyping();
		makeBugEmbed(message.guild, message.author.id, args).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "bug", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "bug", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "settings") {
		message.channel.startTyping();
		makeGuildSettingsEmbed(message.guild.id, args[0], args[1], message.member, message.author.id).then(result => {
			logger.info("Discord API: Message sent succesfully!", { command: "settings", guildID: message.guild.id, discordID: message.author.id });
			message.channel.send(result);
		}).catch(error => {
			logger.info("Discord API: Message sent with an error succesfully!", { command: "settings", guildID: message.guild.id, discordID: message.author.id });
			console.log(error);
		});
		message.channel.stopTyping();
	}
});

client.login(process.env.DISCORD_TOKEN);
