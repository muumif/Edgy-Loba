const { MongoClient, Int32 } = require("mongodb");
//require("dotenv").config();

//const URI = `mongodb://muumi:${process.env.MONGO_PASSWORD}@192.168.8.105:27017/?authMechanism=DEFAULT`;
const URI = "mongodb://muumi:Rokiolitore16@192.168.8.105:27017/?authMechanism=DEFAULT";


const client = new MongoClient(URI);

/**
 * Get if the user exists in the DB
 * @param {String} discordID The discordID of user
 * @returns {boolean} A boolean if the user exists or not
 */
async function getUserExists(discordID) {
	try {
		await client.connect();

		if (await client.db("EdgyLoba").collection("users").findOne({ discordID: discordID }) == null) {
			return Promise.resolve(false);
		}
		return Promise.resolve(true);
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

		const users = await client.db("EdgyLoba").collection("users").find({ guildID: guildID }).sort({ RP: -1 }).limit(10).toArray();

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
 * @return {Array} Return Array of top 10 users
 * @return {Promise} Return Promise.reject when no user data is recorded in the database
 */
async function getTopGlobalUsers() {
	try {
		await client.close();
		const users = await client.db("EdgyLoba").collection("users").find().sort({ RP: -1 }).limit(10).toArray();

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

		const history = await client.db("EdgyLoba").collection("userHistory").find({ discordID: discordID }).sort({ date: -1 }).toArray();

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
async function insertNewUser(guildID, discordID, originUID, RP, platform) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("users").insertOne({
			discordID: discordID,
			originUID: originUID,
			RP: RP,
			platform: platform,
			prefrences: { ranked: "BR" },
			guildID: guildID,
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
async function insertHistoryData(discordID, RP) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("userHistory").insertOne({
			discordID: discordID,
			date: new Date(),
			RP: RP,
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
async function updateUserRP(discordID, RP) {
	try {
		await client.connect();

		return await client.db("EdgyLoba").collection("users").updateOne({ discordID: discordID }, { $set:{ RP: RP } })
			.then(res => {return Promise.resolve("Updated RP successfully!");})
			.catch(err => {return Promise.reject(err);});
	}
	finally {
		await client.close();
	}
}

/**
 * Delete user data form the DB
 * @param {String} discordID
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

module.exports = {
	getUserExists,
	getUserHistory,
	getTopGuildUsers,
	getTopGlobalUsers,
	insertNewUser,
	insertHistoryData,
	updateUserRP,
	deleteUserData,
};
