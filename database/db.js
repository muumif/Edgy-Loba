const { MongoClient } = require("mongodb");
const { logger } = require("../moduels/logger");
require("dotenv").config();

const URI = `mongodb://muumi:${process.env.MONGO_PASSWORD}@192.168.0.13:27017/?authMechanism=DEFAULT`;

const client = new MongoClient(URI);

/**
 * Get if the user exists in the DB
 * @param {String} discordID The discordID of user
 * @returns {boolean} A boolean if the user exists or not
 */
async function getUserExists(discordID) {
	try {
		await client.connect();

		if (await client.db("EdgyLoba").collection("users").findOne({ discordID: discordID.toString() }) == null) {
			logger.info("getUserExists DB: Returning false!", { command: "module: DB", guildID: undefined, discordID: discordID });
			return Promise.resolve(false);
		}

		logger.info("getUserExists DB: Returning true!", { command: "module: DB", guildID: undefined, discordID: discordID });
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
			return logger.error(new Error("getAllUsers DB: No users exist in the DB!"), { command: "module: DB", guildID: undefined, discordID: undefined });
		}
		logger.info("getAllUsers DB: Returning all users! ", { command: "module: DB", guildID: undefined, discordID: undefined });
		return Promise.resolve(users);
	}
	finally {
		await client.close();
	}
}

/**
 * Get the user from database
 * @param {String} discordID The discordID of user
 * @return {Object} Return user data
 * @return {Promise} Return Promise.reject when no user data is inserted in the database
 */
async function getUser(discordID) {
	try {
		await client.connect();

		const user = await client.db("EdgyLoba").collection("users").findOne({ discordID: discordID });

		if (user == null) {
			return logger.error(new Error("getUser DB: User does not exist!"), { command: "module: DB", guildID: undefined, discordID: discordID });
		}
		logger.info("getUser DB: Returning user!", { command: "module: DB", guildID: undefined, discordID: discordID });
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
 * @return {Promise} Return Promise.reject when no user data is inserted in the database
 */
async function getTopGuildUsers(guildID) {
	try {
		await client.connect();

		const users = await client.db("EdgyLoba").collection("users").find({ guilds: guildID }).sort({ RP: -1 }).limit(10).toArray();

		if (users.length == 0) {
			logger.error(new Error("getTopGuildUsers DB: No user data has been inserted for the given server!"), { command: "module: DB", guildID: guildID, discordID: undefined });
			return Promise.reject("No user data has been inserted for this server!");
		}
		logger.info("getTopGuildUsers DB: Returning top 10 guild users! ", { command: "module: DB", guildID: guildID, discordID: undefined });
		return Promise.resolve(users);
	}
	finally {
		await client.close();
	}
}

/**
 * Returns top 10 users in globaly in the DB
 * @param {String} guildID The discord guildID
 * @return {Array} Return Array of top 10 users globally in the db
 * @return {Promise} Return Promise.reject when no user data is inserted in the database
 */
async function getTopGlobalUsers() {
	try {
		await client.connect();
		const users = await client.db("EdgyLoba").collection("users").find().sort({ date: -1 }).limit(10).toArray();

		if (users.length == 0) {
			logger.error(new Error("getTopGlobalUsers DB: No user data has been inserted into the DB!"), { command: "module: DB", guildID: undefined, discordID: undefined });
			return Promise.reject("No users in the database!");
		}

		logger.info("getTopGlobalUsers DB: Returning top 10 global users! ", { command: "module: DB", guildID: undefined, discordID: undefined });
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
 * @return {Promise} Returns Promise.reject when no history data is inserted in the database
 */
async function getUserHistory(discordID) {
	try {
		await client.connect();

		const history = await client.db("EdgyLoba").collection("userHistory").find({ discordID: discordID }).sort({ date: 1 }).toArray();

		if (history.length == 0) {
			logger.error(new Error("getUserHistory DB: No history data exists for given user!"), { command: "module: DB", guildID: undefined, discordID: discordID });
			return Promise.reject("No history data exists for given user!");
		}

		logger.info("getUserHistory DB: Returning history data for given user! ", { command: "module: DB", guildID: undefined, discordID: discordID });
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
			.then(res => {return logger.info("insertNewUser DB: Inserted new user to the DB succesfully: " + res.acknowledged, { command: "module: DB", guildID: guildID, discordID: discordID });})
			.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: guildID, discordID: discordID });});
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
			.then(res => {return logger.info("insertHistoryData DB: Inserted history data for the given user to the DB succesfully: " + res.acknowledged, { command: "module: DB", guildID: undefined, discordID: discordID });})
			.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: undefined, discordID: discordID });});
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
			.then(res => {return logger.info("updateUserRPAP DB: Updated user RPAP in the DB successfully: " + res.acknowledged, { command: "module: DB", guildID: undefined, discordID: discordID });})
			.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: undefined, discordID: discordID });});
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
			.then(res => {return logger.info("deleteUserData DB: Deleted user from the DB succesfully: " + res.acknowledged, { command: "module: DB", guildID: undefined, discordID: discordID });})
			.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: undefined, discordID: discordID });});
	}
	finally {
		await client.close();
	}
}

/**
 * Inserts new guild data to the DB
 * @param {Guild} guild The guild object
 * @return {Promise} Return Promise.resolve when guild was created succesfully
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
			.then(res => {return logger.info("insertNewGuild DB: Inserted a new guild into the DB successfully: " + res.acknowledged, { command: "module: DB", guildID: guild.id, discordID: undefined });})
			.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: guild.id, discordID: undefined });});
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
 * @return {Promise} Return Promise.resolve when settings were updated succesfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function updateGuildSettings(guildID, setting, value) {
	try {
		await client.connect();

		switch (setting) {
		case "modePref": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.modePref": value } })
				.then(res => {return logger.info("updateGuildSettings DB: Updated guild settings in the DB succesfully: " + res.acknowledged, { command: "module: DB", guildID: guildID, discordID: undefined });})
				.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: guildID, discordID: undefined });});
		}

		case "defaultPlatform": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.defaultPlatform": value } })
				.then(res => {return logger.info("updateGuildSettings DB: Updated guild settings in the DB succesfully: " + res.acknowledged, { command: "module: DB", guildID: guildID, discordID: undefined });})
				.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: guildID, discordID: undefined });});
		}

		case "notifyNews": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.notifyNews": value } })
				.then(res => {return logger.info("updateGuildSettings DB: Updated guild settings in the DB succesfully: " + res.acknowledged, { command: "module: DB", guildID: guildID, discordID: undefined });})
				.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: guildID, discordID: undefined });});
		}

		case "newsRole": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.newsRole": value } })
				.then(res => {return logger.info("updateGuildSettings DB: Updated guild settings in the DB succesfully: " + res.acknowledged, { command: "module: DB", guildID: guildID, discordID: undefined });})
				.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: guildID, discordID: undefined });});
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

		logger.info("getGuildSettings DB: Returning guild settings!", { command: "module: DB", guildID: guildID, discordID: undefined });
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
 * @return {Promise} Return Promise.resolve when bug report was created succesfully
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
			.then(res => {return logger.info("insertNewBug DB: Inserted a new bug to the DB! " + res.acknowledged, { command: "module: DB", guildID: guild.id, discordID: undefined });})
			.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: guild.id, discordID: undefined });});
	}
	finally {
		await client.close();
	}
}

/**
 * Deletes new guild data to the DB
 * @param {Guild} guild The guild object
 * @return {Promise} Return Promise.resolve when guild was deleted succesfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function deleteGuild(guild) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("guilds").deleteOne({ guildID: guild.id })
			.then(res => {return logger.info("deleteGuild DB: Deleted a guild from the DB! " + res.acknowledged, { command: "module: DB", guildID: guild.id, discordID: undefined });})
			.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: guild.id, discordID: undefined });});
	}
	finally {
		await client.close();
	}
}

/**
 * Insert new guild to user data
 * @param {String} discordID The id of the user
 * @param {String} guildID The id of the guild
 * @return {Promise} Return Promise.resolve when guild was inserted succesfully
 * @return {Promise} Return Promise.reject when something went wrong
 */
async function insertUserGuild(discordID, guildID) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("users").updateOne({ discordID: discordID }, { $push: { guilds: guildID } })
			.then(res => {return logger.info("insertUserGuild DB: Inserted new guild for the given user to the DB! " + res.acknowledged, { command: "module: DB", guildID: guildID, discordID: undefined });})
			.catch(err => {return logger.error(new Error(err), { command: "module: DB", guildID: guildID, discordID: undefined });});
	}
	finally {
		await client.close();
	}
}

module.exports = {
	getUserExists,
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
};
