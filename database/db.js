const { MongoClient } = require("mongodb");
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
			return Promise.resolve(false);
		}
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
			return Promise.reject("Wtf no users?");
		}
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
 * @return {Promise} Return Promise.reject when no user data is recorded in the database
 */
async function getUser(discordID) {
	try {
		await client.connect();

		const user = await client.db("EdgyLoba").collection("users").findOne({ discordID: discordID });

		if (user == null) {
			return Promise.reject("User doesent exist!");
		}
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
 * @return {Promise} Return Promise.reject when no user data is recorded in the database
 */
async function getTopGuildUsers(guildID) {
	try {
		await client.connect();

		const users = await client.db("EdgyLoba").collection("users").find({ guilds: guildID }).sort({ RP: -1 }).limit(10).toArray();

		if (users.length == 0) {
			return Promise.reject("No user data has been recorded for this server!");
		}
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
 * @return {Promise} Return Promise.reject when no user data is recorded in the database
 */
async function getTopGlobalUsers() {
	try {
		await client.connect();
		const users = await client.db("EdgyLoba").collection("users").find().sort({ date: -1 }).limit(10).toArray();

		if (users.length == 0) {
			return Promise.reject("No users in the database!");
		}
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
 * @return {Promise} Returns Promise.reject when no history data is recorded in the database
 */
async function getUserHistory(discordID) {
	try {
		await client.connect();

		const history = await client.db("EdgyLoba").collection("userHistory").find({ discordID: discordID }).sort({ date: 1 }).toArray();

		if (history.length == 0) {
			return Promise.reject("No history data has been recorded!");
		}

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
			.then(res => {return Promise.resolve("User inserted successfully to the DB!");})
			.catch(err => {return Promise.reject(err);});
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
			.then(res => {return Promise.resolve("History inserted successfully to the DB!");})
			.catch(err => {return Promise.reject(err);});
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
			.then(res => {return Promise.resolve("Updated RP successfully!");})
			.catch(err => {return Promise.reject(err);});
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
			.then(res => {return Promise.resolve("Deleted user from the DB!");})
			.catch(err => {return Promise.reject(err);});
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
			.then(res => {return Promise.resolve("Guild inserted successfully to the DB!");})
			.catch(err => {return Promise.reject(err);});
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
				.then(res => {return Promise.resolve("Updated succesfully!");})
				.catch(err => {return Promise.reject(err);});
		}

		case "defaultPlatform": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.defaultPlatform": value } })
				.then(res => {return Promise.resolve("Updated succesfully!");})
				.catch(err => {return Promise.reject(err);});
		}

		case "notifyNews": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.notifyNews": value } })
				.then(res => {return Promise.resolve("Updated succesfully!");})
				.catch(err => {return Promise.reject(err);});
		}

		case "newsRole": {
			return await client.db("EdgyLoba").collection("guilds").updateOne({ guildID: guildID }, { $set: { "settings.newsRole": value } })
				.then(res => {return Promise.resolve("Updated succesfully!");})
				.catch(err => {return Promise.reject(err);});
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
			.then(res => {return Promise.resolve("Bug report inserted successfully to the DB!");})
			.catch(err => {return Promise.reject(err);});
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
			.then(res => {return Promise.resolve("Deleted guild from the DB!");})
			.catch(err => {return Promise.reject(err);});
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
			.then(res => {return Promise.resolve("Inserted new guild to the DB!");})
			.catch(err => {return Promise.reject(err);});
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
