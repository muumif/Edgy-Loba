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

const client = new Discord.Client();
const prefix = process.env.PREFIX;

client.once("ready", () => {
	console.log("Online!");
	client.user.setPresence({ activity: { name: ">help", type: "LISTENING" }, status: "online" });
});

client.on("guildCreate", guild => {
	insertNewGuild(guild).then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	});
});

client.on("guildDelete", guild => {
	deleteGuild(guild).then(res => {
		console.log(res);
	}).catch(err => {
		console.log(err);
	});
});

client.on("message", async message => {

	if (message.author.bot) return;
	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "help") {
		message.channel.startTyping();
		makeHelpEmbed(args[0]).then(result => {
			message.channel.send(result);
		});
		message.channel.stopTyping();
	}

	if (command === "info") {
		message.channel.startTyping();
		makeInfoEmbed().then(result => {
			message.channel.send(result);
		});
		message.channel.stopTyping();
	}

	if (command === "link") {
		message.channel.startTyping();
		makeLinkEmbed(args[0], args[1], message.guild.id, message.author.id, message.author).then(result => {
			message.channel.send(result);
		}).catch(error => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "unlink") {
		message.channel.startTyping();
		makeUnlinkEmbed(message.author.id).then(result => {
			message.channel.send(result);
		}).catch(error => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "stats") {
		message.channel.startTyping();
		makeStatsEmbed(args[0], args[1], message.author.id).then(result => {
			message.channel.send(result);
		}).catch(error => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "top") {
		message.channel.startTyping();
		makeTopEmbed(message.guild.id).then(result => {
			message.channel.send(result);
		}).catch((error) => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "map") {
		message.channel.startTyping();
		makeMapEmbed().then(result => {
			message.channel.send(result);
		}).catch(error => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "status") {
		message.channel.startTyping();
		makeStatusEmbed().then(result => {
			message.channel.send(result);
		}).catch(error => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "pred" || command === "predator") {
		message.channel.startTyping();
		makePredatorEmbed().then(result => {
			message.channel.send(result);
		}).catch(error => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command == "crafting") {
		message.channel.startTyping();
		makeCraftingEmbed().then(result => {
			message.channel.send(result);
		}).catch(error => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "news") {
		message.channel.startTyping();
		makeNewsEmbed().then(result => {
			message.channel.send(result);
		}).catch(error => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}
});

client.login(process.env.DISCORD_TOKEN);
