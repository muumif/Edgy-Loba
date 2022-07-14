/**
 * Some of theses commands are unused and some are duplicates.
 * This file should be reworked at some point probably when Redis caching is implemented.
 * MongoDB should also be secured better but for now it works.

 * @file Contains every command needed to interact with MongoDB.
 * @author muumif
 * @version 1.0.0
*/

const { MongoClient } = require("mongodb");
const { logger } = require("./logger");
require("dotenv").config();

const URI = `mongodb://muumi:${process.env.MONGO_PASSWORD}@192.168.0.13:27017/?authMechanism=DEFAULT`;

const client = new MongoClient(URI);

/**
 * Get if the user exists in the DB
 * @param {String} discordID The discordID of user
 * @returns {boolean} A boolean if the user exists or not
 */
async function getUserExistsDiscord(discordID) {
	try {
		await client.connect();

		if (await client.db("EdgyLoba").collection("users").findOne({ discordID: discordID.toString() }) == null) {
			logger.info("User doesn't exist in the DB!", { DBOP: "getUserExistsDiscord", discordID: discordID });
			return Promise.resolve(false);
		}

		logger.info("Fetched user!", { DBOP: "getUserExistsDiscord", discordID: discordID });
		return Promise.resolve(true);
	}
	finally {
		await client.close();
	}
}

async function getUserExistsGame(UID) {
	try {
		await client.connect();

		if (await client.db("EdgyLoba").collection("users").findOne({ originUID: UID.toString() }) == null) {
			logger.info("User doesn't exist in the DB!", { DBOP: "getUserExistsGame", UID: UID });
			return Promise.resolve(false);
		}

		logger.info("Fetched user!", { DBOP: "getUserExistsGame", UID: UID });
		return Promise.resolve(true);

	}
	finally {
		await client.close();
	}
}

/**
 * Get all users from the DB
 * @returns {Array} An array of all users
 */
async function getAllUsers() {
	try {
		await client.connect();

		const users = await client.db("EdgyLoba").collection("users").find({}, { discordID: 1, originUID: 1, platform: 1 }).toArray();

		if (users == null) {
			return logger.error(new Error("No users exist in the DB! Bizarre..."), { DBOP: "getAllUsers" });
		}
		logger.info("Fetched all users from the DB!", { DBOP: "getAllUsers" });
		return Promise.resolve(users);
	}
	finally {
		await client.close();
	}
}

/**
 * Get the user from misc
 * @param {String} discordID The discordID of user
 * @return {Object} Return user data
 * @return {Promise} Return Promise.reject when no user data is inserted in the misc
 */
async function getUser(discordID) {
	try {
		await client.connect();

		const user = await client.db("EdgyLoba").collection("users").findOne({ discordID: discordID });

		if (user == null) {
			return logger.error(new Error("No user exists in the DB!"), { DBOP: "getUser", discordID: discordID });
		}
		logger.info("Fetched user!", { DBOP: "getUser", discordID: discordID });
		return Promise.resolve(user);
	}
	finally {
		await client.close();
	}
}

async function getUserOrigin(UID) {
	try {
		await client.connect();

		const user = await client.db("EdgyLoba").collection("users").findOne({ originUID: UID });

		if (user == null) {
			return logger.error(new Error("No user exists in the DB!"), { DBOP: "getUserOrigin", originUID: UID });
		}
		logger.info("Fetched user!", { DBOP: "getUserOrigin", originUID: UID });
		return Promise.resolve(user);
	}
	finally {
		await client.close();
	}
}

/**
 * Returns top 10 users in given guild
 * @param {String} guildID The discord guildID
 * @return {Array} Return Array of top 10 guild users
 * @return {Promise} Return Promise.reject when no user data is inserted in the misc
 */
async function getTopGuildUsers(guildID) {
	try {
		await client.connect();

		const users = await client.db("EdgyLoba").collection("users").find({ guilds: guildID }).sort({ RP: -1 }).limit(10).toArray();

		if (users.length == 0) {
			logger.error(new Error("No user data has been recorded for the given server!"), { DBOP: "getTopGuildUsers", guildID: guildID });
			return Promise.reject("No user data has been inserted for this server!");
		}
		logger.info("Fetched top 10 guild users! ", { DBOP: "getTopGuildUsers", guildID: guildID });
		return Promise.resolve(users);
	}
	finally {
		await client.close();
	}
}

/**
 * Returns top 10 users in globally in the DB
 * @return {Array} Return Array of top 10 users globally in the db
 * @return {Promise} Return Promise.reject when no user data is inserted in the misc
 */
async function getTopGlobalUsers() {
	try {
		await client.connect();
		const users = await client.db("EdgyLoba").collection("users").find().sort({ RP: -1 }).limit(3).toArray();

		if (users.length == 0) {
			logger.error(new Error("No user data has been recorded in the DB!"), { DBOP: "getTopGlobalUsers" });
			return Promise.reject("No users in the misc!");
		}

		logger.info("Fetched top 10 global users!", { DBOP: "getTopGlobalUsers" });
		return Promise.resolve(users);
	}
	finally {
		await client.close();
	}
}

/**
 * Get users history
 * @param {String} discordID The discordID of user
 * @return {Array} Return Array of history objects ordered by date
 * @return {Promise} Returns Promise.reject when no history data is inserted in the misc
 */
async function getUserHistory(discordID) {
	try {
		await client.connect();

		const history = await client.db("EdgyLoba").collection("userHistory").find({ discordID: discordID }).sort({ date: 1 }).toArray();

		if (history.length == 0) {
			logger.error(new Error("No history data exists for the given user!"), { DBOP: "getUserHistory", discordID: discordID });
			return Promise.resolve("No history data exists for given user!");
		}

		logger.info("Fetched user history data!", { DBOP: "getUserHistory", discordID: discordID });
		return Promise.resolve(history);
	}
	finally {
		await client.close();
	}
}

/**
 * Get users history
 * @param {String} discordID The discordID of user
 * @return {Array} Return Array of history objects ordered by date
 * @return {Promise} Returns Promise.reject when no history data is inserted in the misc
 */
async function getUserHistoryGame(originUID) {
	try {
		await client.connect();

		const history = await client.db("EdgyLoba").collection("userHistory").find({ originUID: originUID }).sort({ date: 1 }).toArray();

		if (history.length == 0) {
			logger.error(new Error("No history data exists for the given user!"), { DBOP: "getUserHistory", originUID: originUID });
			return Promise.reject("No history data exists for given user!");
		}

		logger.info("Fetched user history data!", { DBOP: "getUserHistory", originUID: originUID });
		return Promise.resolve(history);
	}
	finally {
		await client.close();
	}
}

/**
 * Inserts new user to the DB
 * @param {String} guildID The guildID of the user to set
 * @param {String} discordID The discordID of the user to set
 * @param {String} originUID The origin ID of the user to set
 * @param {Int32} RP The users current RP
 * @param {String} platform The users current platform
 * @return {Promise} Returns Promise.resolve when user was created successfully
 * @return {Promise} Returns Promise.reject when something went wrong
 */
async function insertNewUser(guildID, discordID, originUID, RP, AP, platform) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("users").insertOne({
			discordID: discordID,
			originUID: originUID,
			RP: RP,
			AP: AP,
			platform: platform,
			prefrences: { ranked: "BR" },
			guilds: [guildID],
		})
			.then(function() { return logger.info("New user has been inserted!", { DBOP: "insertNewUser", guildID: guildID, discordID: discordID });})
			.catch(err => {return logger.error(new Error(err), { DBOP: "insertNewUser", guildID: guildID, discordID: discordID });});
	}
	finally {
		await client.close();
	}
}

/**
 * Inserts new history data to the DB
 * @param {String} discordID The discordID of the user to set
 * @param {Int32} RP The users current RP
 * @return {Promise} Return Promise.resolve when history data was created successfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function insertHistoryData(discordID, RP, AP) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("userHistory").insertOne({
			discordID: discordID,
			date: new Date(),
			RP: RP,
			AP: AP,
		})
			.then(function() {return logger.info("New history data has been inserted!", { DBOP: "insertHistoryData", discordID: discordID });})
			.catch(err => {return logger.error(new Error(err), { DBOP: "insertHistoryData", discordID: discordID });});
	}
	finally {
		await client.close();
	}
}

/**
 * Update user RP data
 * @param {String} discordID The discordID of the user to set
 * @param {Int32} RP The users current RP
 * @return {Promise} Return Promise.resolve when RP was update successfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function updateUserRPAP(discordID, RP, AP) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("users").updateOne({ discordID: discordID }, { $set:{ RP: RP, AP: AP } })
			.then(function() {return logger.info("User RP/AP has been updated!", { DBOP: "updateUserRPAP", discordID: discordID });})
			.catch(err => {return logger.error(new Error(err), { DBOP: "updateUserRPAP", discordID: discordID });});
	}
	finally {
		await client.close();
	}
}

/**
 * Delete user data form the DB
 * @param {String} discordID The discordID of the user to set
 * @return {Promise} Return Promise.resolve when user was deleted
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function deleteUserData(discordID) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("users").deleteOne({ discordID: discordID })
			.then(function() {return logger.info("User has been deleted!", { DBOP: "deleteUserData", discordID: discordID });})
			.catch(err => {return logger.error(new Error(err), { DBOP: "deleteUserData", discordID: discordID });});
	}
	finally {
		await client.close();
	}
}

/**
 * Inserts new guild data to the DB
 * @param {Guild} guild The guild object
 * @return {Promise} Return Promise.resolve when guild was created successfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function insertNewGuild(guild) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("guilds").insertOne({
			guildID: guild.id,
			guildName: guild.name,
			settings: { modePref: "BR", defaultPlatform: "PC", notifyNews: false, newsRole: undefined },
		})
			.then(res => {return logger.info("New guild has been inserted!", { DBOP: "insertNewGuild", guildID: guild.id });})
			.catch(err => {return logger.error(new Error(err), { DBOP: "insertNewGuild", guildID: guild.id });});
	}
	finally {
		await client.close();
	}
}

/**
 * Update guild settings
 * @param {String} guildID The guildID
 * @param {String} setting The setting to change
 * @param {String} value The value to change the setting to
 * @return {Promise} Return Promise.resolve when settings were updated successfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function updateGuildSettings(guildID, setting, value) {
	try {
		await client.connect();

		switch (setting) {
		case "modePref": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.modePref": value } })
				.then(function() {return logger.info("Guild modePref setting updated!", { DBOP: "updateGuildSettings", guildID: guildID });})
				.catch(err => {return logger.error(new Error(err), { DBOP: "updateGuildSettings", guildID: guildID });});
		}

		case "defaultPlatform": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.defaultPlatform": value } })
				.then(function() {return logger.info("Guild defaultPlatform setting updated!", { DBOP: "updateGuildSettings", guildID: guildID });})
				.catch(err => {return logger.error(new Error(err), { DBOP: "updateGuildSettings", guildID: guildID });});
		}

		case "notifyNews": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.notifyNews": value } })
				.then(function() {return logger.info("Guild notifyNews setting updated!", { DBOP: "updateGuildSettings", guildID: guildID });})
				.catch(err => {return logger.error(new Error(err), { DBOP: "updateGuildSettings", guildID: guildID });});
		}

		case "newsRole": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.newsRole": value } })
				.then(function() {return logger.info("Guild newsRole setting updated!", { DBOP: "updateGuildSettings", guildID: guildID });})
				.catch(err => {return logger.error(new Error(err), { DBOP: "updateGuildSettings", guildID: guildID });});
		}
		}
	}
	finally {
		await client.close();
	}
}

async function getGuildSettings(guildID) {
	try {
		await client.connect();

		const settings = await client.db("EdgyLoba").collection("guilds").findOne({ guildID: guildID }, { settings: 1 });

		logger.info("Fetched guild settings!", { DBOP: "getGuildSettings", guildID: guildID });
		return Promise.resolve(settings);
	}
	finally {
		await client.close();
	}
}

/**
 * Inserts new bug report to DB
 * @param {Guild} guild The guild object
 * @param {String} userID The userID of user that reported
 * @param {String} command The command that there are issues with
 * @param {String} message The message of bug report
 * @return {Promise} Return Promise.resolve when bug report was created successfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function insertNewBug(guild, userID, command, message) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("bugs").insertOne({
			guildID: guild.id,
			userID: userID,
			date: new Date(),
			bug: {
				command: command,
				message: message,
			},
		})
			.then(function() {return logger.info("New bug inserted!", { DBOP: "insertNewBug", guildID: guild.id });})
			.catch(err => {return logger.error(new Error(err), { DBOP: "insertNewBug", guildID: guild.id });});
	}
	finally {
		await client.close();
	}
}

/**
 * Deletes new guild data to the DB
 * @param {Guild} guild The guild object
 * @return {Promise} Return Promise.resolve when guild was deleted successfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function deleteGuild(guild) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("guilds").deleteOne({ guildID: guild.id })
			.then(function() {return logger.info("Guild has been deleted!", { DBOP: "deleteGuild", guildID: guild.id });})
			.catch(err => {return logger.error(new Error(err), { DBOP: "deleteGuild", guildID: guild.id });});
	}
	finally {
		await client.close();
	}
}

/**
 * Insert new guild to user data
 * @param {String} discordID The id of the user
 * @param {String} guildID The id of the guild
 * @return {Promise} Return Promise.resolve when guild was inserted successfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function insertUserGuild(discordID, guildID) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("users").updateOne({ discordID: discordID }, { $push: { guilds: guildID } })
			.then(function() {return logger.info("New guild inserted!", { DBOP: "insertUserGuild", guildID: guildID });})
			.catch(err => {return logger.error(new Error(err), { DBOP: "insertUserGuild", guildID: guildID });});
	}
	finally {
		await client.close();
	}
}

module.exports = {
	getUserExistsDiscord,
	getUserHistory,
	getUser,
	getAllUsers,
	getTopGuildUsers,
	getTopGlobalUsers,
	insertNewUser,
	insertHistoryData,
	updateUserRPAP,
	deleteUserData,
	insertNewGuild,
	deleteGuild,
	insertNewBug,
	insertUserGuild,
	updateGuildSettings,
	getGuildSettings,
	getUserExistsGame,
	getUserOrigin,
	getUserHistoryGame,
};
