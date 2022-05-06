const Discord = require("discord.js");
const config = require("./config.json"); //TODO: Get rid of config.json and go over to .env file
const axios = require("axios");
const firebase = require("firebase/app");
require("dotenv").config();
const { set, getDatabase, ref, get, child } = require("firebase/database");

const { makeMapEmbed } = require("./commands/apexMisc/map");
const { makeStatusEmbed } = require("./commands/apexMisc/status");
const { makeTopEmbed } = require("./commands/userStats/localTop");
const { makeHelpEmbed } = require("./commands/help");
const { makeStatsEmbed } = require("./commands/userStats/stats");
const { makeLinkEmbed } = require("./commands/userStats/link");
const { makeUnlinkEmbed } = require("./commands/userStats/unlink");
const { makePredatorEmbed } = require("./commands/apexMisc/predCap");
const { makeCraftingEmbed } = require("./commands/apexMisc/crafting");
const { makeNewsEmbed } = require("./commands/apexMisc/news");

const client = new Discord.Client();
const prefix = process.env.PREFIX;

//TODO: Remove evrything expect commands and calls to other command modules

const firebaseConfig = {
	apiKey: process.env.FIREBASE_APIKEY,
	authDomain: "edgyloba.firebaseapp.com",
	databaseURL: "https://edgyloba-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "edgyloba",
	storageBucket: "edgyloba.appspot.com",
	messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
	appId: process.env.FIREBASE_APPID,
};

const app = firebase.initializeApp(firebaseConfig);

function writeUserData(guildID, userID, name, currentRP, rankIMG, platform, level) {
	const database = getDatabase(app);
	set(ref(database, "guilds/" + guildID + "/users/" + userID), {
		username: name,
		platform: platform,
		level: level,
		RP: currentRP,
		img: rankIMG,
	});
}

function writeHistoryData(rp, userID, guildID) {
	const today = new Date();
	const monthVal = today.getUTCMonth() + 1;
	const date = today.getUTCDate() + "-" + monthVal + "-" + today.getUTCFullYear();

	const database = getDatabase(app);
	set(child(ref(database), "guilds/" + guildID + "/history/" + userID + "/" + date), {
		date: date,
		rp: rp,
	});
}

async function getHistoryData(guildID, userID, _callback) {
	const dbRef = ref(getDatabase(app));
	const labels = [], dataArray = [];

	await get(child(dbRef, "guilds/" + guildID + "/history/" + userID))
		.then((snapshot) => {
			if (snapshot.exists) {
				snapshot.forEach(function(data) {
					labels.push(data.val().date);
					dataArray.push(data.val().rp);
				});
			}
		}).catch((error) => {
			console.log(error);
		});


	const arrayPairs = labels.map(function(a, b) {return [a, dataArray[b]];});
	for (let i = 0; i < arrayPairs.length; i++) {
		arrayPairs[i][0] = arrayPairs[i][0].split("-").reverse().join("/");
	}

	arrayPairs.sort(function(a, b) {
		const dateA = new Date(a[0]), dateB = new Date(b[0]);
		return dateA - dateB;
	});

	const finalLabels = [], finalDataArray = [];
	for (let i = 0; i < arrayPairs.length; i++) {
		finalLabels.push(arrayPairs[i][0]);
		finalDataArray.push(arrayPairs[i][1]);
	}

	_callback(finalLabels, finalDataArray);
}

async function fetchUser(id, callback) {
	const user = await client.users.fetch(id);
	callback(user);
}

//TODO: Chart module and better chart making
function makeChart(_labels = [], _data = []) {
	const chart = `https://image-charts.com/chart.js/2.8.0?bkg=rgb(54,57,63)&c={type:'line',data:{labels:[${_labels.map(function(ele) {return "'" + ele + "'";})}],datasets:[{backgroundColor:'rgba(44,47,51,0)',borderColor:'rgb(277,166,0)',data:[${_data}],label:'RP'}]},options:{scales:{yAxes:[{ticks:{stepSize: 200}}]}}}`;
	return encodeURI(chart);
}

client.once("ready", () => {
	console.log("Edgy Loba is now online!");
	client.user.setPresence({ activity: { name: ">help", type: "LISTENING" }, status: "online" });
});

client.on("message", async message => {

	if (message.author.bot) return;
	if (message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "help") {
		makeHelpEmbed().then(result => {
			message.channel.send(result);
		});
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
		let IGN;
		let platform;
		const dbRef = ref(getDatabase(app));

		if (args[0] == undefined) {
			await get(child(dbRef, "guilds/" + message.guild.id + "/users/" + message.author.id))
				.then((snapshot) => {
					if (!snapshot.exists()) {
						const embed1 = new Discord.MessageEmbed()
							.setTitle("No username has been linked!")
							.setDescription("You can link your username: **!link (Apex username) (PC/PS4/X1)**")
							.setColor("#e3a600");
						return message.channel.send({ embed1 });
					}
					else {
						const data = snapshot.val();
						IGN = data.username;
					}
				}).catch((error) => {
					message.channel.send(
						new Discord.MessageEmbed()
							.setTitle("Error")
							.setDescription(error)
							.setColor("#e3a600"),
					);
					message.channel.stopTyping();
				});
		}
		else {(IGN = args[0]);}

		if (args[1] == undefined) {
			await get(child(dbRef, "guilds/" + message.guild.id + "/users/" + message.author.id))
				.then((snapshot) => {
					if (!snapshot.exists()) {
						const embed2 = new Discord.MessageEmbed()
							.setTitle("No username has been linked")
							.setDescription(`You can link your username: **!link ${args[0]} (PC/PS4/X1)**`)
							.setColor("#e3a600");
						message.channel.send({ embed2 });
					}
					else {
						const data = snapshot.val();
						platform = data.platform;
					}
				}).catch((error) => {
					message.channel.send(
						new Discord.MessageEmbed()
							.setTitle("Error")
							.setDescription(error.response.data.Error)
							.setColor("#e3a600"),
					);
					message.channel.stopTyping();
				});
		}
		else {platform = args[1];}

		message.channel.startTyping();

		setTimeout(async () => {
			const URI = `https://api.mozambiquehe.re/bridge?version=5&platform=${platform.toUpperCase()}&player=${IGN}&auth=${config.ALS_Token}`;
			const encodedURI = encodeURI(URI);
			await axios.get(encodedURI)
				.then(function(response) {
					const embed = new Discord.MessageEmbed()
						.setTitle("Stats for " + response.data.global.name)
						.setAuthor("Platform: " + platform.toUpperCase())
						.setThumbnail(response.data.global.rank.rankImg)
						.addFields(
							{
								name: "__Level__",
								value: response.data.global.level,
								inline: true,
							},
							{
								name: "__Rank__",
								value: response.data.global.rank.rankName + " " + response.data.global.rank.rankDiv,
								inline: true,
							},
							{
								name: "__RP__",
								value: response.data.global.rank.rankScore,
								inline: true,
							},
						)
						.setColor("#e3a600");
					if (args[0] == undefined) {
						get(child(dbRef, "guilds/" + message.guild.id + "/users/" + message.author.id))
							.then((snapshot) => {
								if (snapshot.exists()) {
									writeUserData(message.guild.id, message.author.id, response.data.global.name, response.data.global.rank.rankScore, response.data.global.rank.rankImg, platform, response.data.global.level);
									writeHistoryData(response.data.global.rank.rankScore, message.author.id, message.guild.id);
									getHistoryData(message.guild.id, message.author.id, function(_labels, _data) {
										embed.setImage(makeChart(_labels, _data));
										embed.setDescription("Account linked to " + message.author.tag);
										message.channel.send({ embed });
									});
								}
							}).catch((error) => {
								message.channel.send(
									new Discord.MessageEmbed()
										.setTitle("Error")
										.setDescription(error)
										.setColor("#e3a600"),
								);
								message.channel.stopTyping();
							});
					}
					else {
						get(child(dbRef, "guilds/" + message.guild.id + "/users/"))
							.then((snapshot) => {
								if (snapshot.exists()) {
									snapshot.forEach(function(user) {
										if (user.val().username == response.data.global.name) {
											writeHistoryData(response.data.global.rank.rankScore, user.key, message.guild.id);
											getHistoryData(message.guild.id, user.key, function(_labels, _data) {
												embed.setImage(makeChart(_labels, _data));
												fetchUser(user.key, function(a) {
													embed.setDescription("Account linked to " + a.username + "#" + a.discriminator);
													message.channel.send({ embed });
												});
											});
										}
									});
								}
							}).catch((error) => {
								message.channel.send(
									new Discord.MessageEmbed()
										.setTitle("Error")
										.setDescription(error)
										.setColor("#e3a600"),
								);
							});
					}

					message.channel.stopTyping();

				}).catch((error) => {
					message.channel.send(
						new Discord.MessageEmbed()
							.setTitle("Error")
							.setDescription(error)
							.setColor("#e3a600"),
					);
					message.channel.stopTyping();
				});
		}, 250);
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

	if (command === "pred") {
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
