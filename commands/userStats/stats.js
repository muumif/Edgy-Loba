const Discord = require("discord.js");
const axios = require("axios");
const { getUserUID } = require("../../moduels/getUID");
const { makeStatsChart } = require("../../moduels/charts");
const { getUserExists, getUser, updateUserRPAP, getUserHistory, insertUserGuild } = require("../../database/db");
const { UIDToIGN } = require("../../moduels/UIDToIGN");
require("dotenv").config();

const client = new Discord.Client();

async function fetchUser(id) {
	return await client.users.fetch(id).then(result => {
		return result;
	});
}

async function getData(UID, platform) {
	const URI = `${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}`;
	return axios.get(encodeURI(URI))
		.then(function(response) {
			return response;
		}).catch(function(error) {
			const embed = new Discord.MessageEmbed()
				.setColor("#e3a600");
			switch (error.response.status) {
			case 400:
				embed.setTitle("Something went wrong.");
				embed.setDescription("Try again in a few minutes.");
				return Promise.reject(embed);
			case 403:
				embed.setTitle("Unauthorized / Unknown API key.");
				embed.setDescription("The bot might be worked on at this moment. If this continues to happen report it with /bug.");
				return Promise.reject(embed);
			case 404:
				embed.setTitle("Player could not be found.");
				embed.setDescription("If this continues to happen check that you are using your origin username or report the bug with /bug.");
				return Promise.reject(embed);
			case 405:
				embed.setTitle("External API error.");
				embed.setDescription("Try again in a few seconds.");
				return Promise.reject(embed);
			case 410:
				embed.setTitle("Unknown platform provided.");
				embed.setDescription("If this continues to happen report it as a bug with /bug");
				return Promise.reject(embed);
			case 429:
				embed.setTitle("API Rate limit reached.");
				embed.setDescription("Try again in a few seconds.");
				return Promise.reject(embed);
			case 500:
				embed.setDescription("API Internal error.");
				return Promise.reject(embed);
			}
		});
}

async function makeStatsEmbed(_IGN, _platform, userID, guildID) {
	let UID;
	let platform = _platform;
	let userDBrp;
	let userDBap;

	if (platform != undefined) {
		if (platform == "pc" || platform == "ORIGIN" || platform == "origin") {
			platform = "PC";
		}
		if (platform == "x" || platform == "X" || platform == "xbox" || platform == "XBOX" || platform == "x1") {
			platform = "X1";
		}
		if (platform == "ps" || platform == "PS" || platform == "playstation" || platform == "PLAYSTATION" || platform == "ps4" || platform == "PS4" || platform == "ps5" || platform == "PS5") {
			platform = "PS4";
		}
		if (platform == "switch" || platform == "nintendo" || platform == "NINTENDO") {
			platform = "SWITCH";
		}
	}

	if (_IGN == undefined) {
		return await getUserExists(userID).then(async exists => {
			if (exists == true) {
				await getUser(userID).then(async userDB => {
					UID = userDB.originUID;
					platform = userDB.platform;
					userDBrp = userDB.RP;
					userDBap = userDB.AP;
					for (let i = 0; i < userDB.guilds.length; i++) {
						if (userDB.guilds[i] == guildID) {
							return;
						}
						await insertUserGuild(userID, guildID);
					}
				});
				return await getData(UID, platform).then(async result => {
					const embed = new Discord.MessageEmbed()
						.setTitle(result.data.global.name)
						.setAuthor("Platform: " + platform)
						.setThumbnail(result.data.global.rank.rankImg)
						.addFields(
							{
								name: "__Level__",
								value: result.data.global.level,
								inline: true,
							},
							{
								name: "__Battle Royale__",
								value: result.data.global.rank.rankName + " " + result.data.global.rank.rankDiv + "\nRP: " + result.data.global.rank.rankScore + ` (${userDBrp - result.data.global.rank.rankScore})`,
								inline: true,
							},
							{
								name: "__Arenas__",
								value: result.data.global.arena.rankName + " " + result.data.global.arena.rankDiv + "\nAP: " + result.data.global.arena.rankScore + ` (${userDBap - result.data.global.arena.rankScore})`,
								inline: true,
							},
						)
						.setColor("#e3a600")
						.setTimestamp()
						.setFooter("Existing user", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
					await fetchUser(userID).then(ID => {
						embed.setDescription("Linked to " + ID.username + "#" + ID.discriminator);
					});
					await updateUserRPAP(userID, result.data.global.rank.rankScore, result.data.global.arena.rankScore);
					return await getUserHistory(userID).then(history => {
						const labels = [], data = [];
						for (let i = 0; i < history.length; i++) {
							const date = new Date(history[i].date).getUTCDate() + "/" + (new Date(history[i].date).getUTCMonth() + 1) + "/" + new Date(history[i].date).getUTCFullYear();
							labels.push(date);
							data.push(history[i].RP);
						}
						embed.setImage(makeStatsChart(labels, data));
						return embed;
					}).catch(error => {
						return embed;
					});
				}).catch(error => {
					return Promise.reject(error);
				});
			}
			else {
				const embed = new Discord.MessageEmbed()
					.setTitle("No IGN given or account hasn't been linked!")
					.setDescription(">stats **[Apex IGN] [PC | Xbox | Playstation | Switch]**\n>link **[Apex IGN] [PC | Xbox | Playstation | Switch]**")
					.setColor("#e3a600")
					.setTimestamp()
					.setFooter("Error page", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
				return embed;
			}
		});
	}

	if (platform == undefined) {
		const embed = new Discord.MessageEmbed()
			.setTitle("No platform given!")
			.setDescription(">stats **[Apex IGN] [PC | Xbox | Playstation | Switch]**")
			.setColor("#e3a600")
			.setTimestamp()
			.setFooter("Error page", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		return embed;
	}

	if (UID == undefined) {
		let apexResult;
		const embed = new Discord.MessageEmbed();

		await getUserUID(_IGN, platform).then(_UID => {
			UID = _UID;
		}).catch(error => {
			return Promise.reject(error);
		});

		await getData(UID, platform).then(result => {
			apexResult = result;
			embed.setTitle(result.data.global.name);
			embed.setAuthor("Platform: " + platform);
			embed.setThumbnail(result.data.global.rank.rankImg);
			embed.addFields(
				{
					name: "__Level__",
					value: result.data.global.level,
					inline: true,
				},
			);
			embed.setColor("#e3a600");
			embed.setTimestamp();
			embed.setFooter("Bugs can be reported with >bug", "https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=256");
		}).catch(error => {
			return Promise.reject(error);
		});

		const makeEmbed = async _ => {
			return await getUserExists(userID).then(async exists => {
				return await getUser(userID).then(async user => {
					if (exists == true && _IGN == await UIDToIGN(user.originUID, platform)) {
						for (let i = 0; i < user.guilds.length; i++) {
							if (user.guilds[i] == guildID) {
								return;
							}
							await insertUserGuild(userID, guildID);
						}
						await fetchUser(userID).then(discordUser => {
							embed.setDescription("Linked to " + discordUser.username + "#" + discordUser.discriminator);
						});
						embed.addFields(
							{
								name: "__Battle Royale__",
								value: apexResult.data.global.rank.rankName + " " + apexResult.data.global.rank.rankDiv + "\nRP: " + apexResult.data.global.rank.rankScore + ` (${user.RP - apexResult.data.global.rank.rankScore})`,
								inline: true,
							},
							{
								name: "__Arenas__",
								value: apexResult.data.global.arena.rankName + " " + apexResult.data.global.arena.rankDiv + "\nAP: " + apexResult.data.global.arena.rankScore + ` (${user.AP - apexResult.data.global.arena.rankScore})`,
								inline: true,
							},
						);
						await updateUserRPAP(userID, apexResult.data.global.rank.rankScore, apexResult.data.global.arena.rankScore);
						const labels = [], data = [];
						return await getUserHistory(userID).then(async history => {
							if (history == "No history data has been recorded!") {
								return;
							}
							for (let i = 0; i < history.length; i++) {
								const date = new Date(history[i].date).getUTCDate() + "/" + (new Date(history[i].date).getUTCMonth() + 1) + "/" + new Date(history[i].date).getUTCFullYear();
								labels.push(date);
								data.push(history[i].RP);
							}
							embed.setImage(makeStatsChart(labels, data));
							return embed;
						}).catch(error => {
							return embed;
						});
					}
					else {
						embed.addFields(
							{
								name: "__Battle Royale__",
								value: apexResult.data.global.rank.rankName + " " + apexResult.data.global.rank.rankDiv + "\nRP: " + apexResult.data.global.rank.rankScore,
								inline: true,
							},
							{
								name: "__Arenas__",
								value: apexResult.data.global.arena.rankName + " " + apexResult.data.global.arena.rankDiv + "\nAP: " + apexResult.data.global.arena.rankScore,
								inline: true,
							},
						);
					}
				});
			});
		};
		await makeEmbed();
		return embed;
	}
}

module.exports = {
	makeStatsEmbed,
};