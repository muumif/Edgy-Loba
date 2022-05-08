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

const client = new Discord.Client();
const prefix = process.env.PREFIX;

//TODO: Changable per guild with server settings
//TODO: Server settings command
//TODO: User prefrences command
//TODO: Update stats and top every day at 23:59 for every guild
//TODO: Error codes for every command
//TODO: crafting.js command
//TODO: map.js error codes
//TODO: news.js error codes
//TODO: predCap.js error codes
//TODO: status.js error codes
//TODO: store.js command
//TODO: link.js Verifying that the user is acctualy who they claim to be
//TODO: link.js/help.js Reminder to use origin name not steam
//TODO: localTop.js Chart where all the users are in goes together with charts.js
//TODO: localtop.js error codes
//TODO: stats.js Clubs when works better it works better
//TODO: stats.js Let user choose if arenas ranked or BR ranked or both when cheking stats goes together with user prefrences command
//TODO: stats.js error codes
//TODO: stats.js l167 Update user data geos together with firebaseSet.js
//TODO: unlink.js error codes
//TODO: help.js command rework with diffrent categories
//TODO: help.js error codes
//TODO: firebaseGet.js error codes
//TODO: firebaseSet.js Update user data function
//TODO: firebaseSet.js error codes
//TODO: charts.js makeTopChart function
//TODO: getUID.js error codes
//TODO: UIDToIGN.js error codes


client.once("ready", () => {
	client.user.setPresence({ activity: { name: ">help", type: "LISTENING" }, status: "online" });
});

client.on("message", async message => {

	if (message.author.bot) return;
	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "help") {
		message.channel.startTyping();
		makeHelpEmbed().then(result => {
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
		makeUnlinkEmbed(message.guild.id, message.author.id).then(result => {
			message.channel.send(result);
		}).catch(error => {
			message.channel.send(error);
		});
		message.channel.stopTyping();
	}

	if (command === "stats") {
		message.channel.startTyping();
		makeStatsEmbed(args[0], args[1], message.guild.id, message.author.id).then(result => {
			message.channel.send(result);
		}).catch(error => {
			console.log(error);
		});
		message.channel.stopTyping();
	}

	if (command === "top") {
		message.channel.startTyping();
		makeTopEmbed(message.guild.id, message.author.id).then(result => {
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
