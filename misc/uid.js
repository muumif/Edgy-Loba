/**
 * @file Functions for user UID and IGN management.
 * @author muumif
 * @version 1.0.0
*/

const axios = require("axios");
require("dotenv").config();
const { logger } = require("./internal/logger");
const JSONBigInt = require("json-bigint")({ "storeAsString": true });

/** 
 * @param  {string} IGN User IGN
 * @param  {string} platform User platform
 * @param  {string} guildID GuildID where the command was ran
 * @param  {string} discordID User discordID
 * @return {string} User UID
 */
async function getUserUID(IGN, platform, guildID, discordID) {
	try {
		const response = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`), { transformResponse: [data => data] });
		if (response.data.includes("Error")) { // This is used to check for Errors instead of catch. Could throw an error then handle it in catch.
			logger.error(new Error(response.data), { module: "getUserUID", guildID: guildID, discordID: discordID, data: response.data, IGN: IGN, platform: platform });
			if (response.data.includes("Slow down !")) {
				return Promise.reject({ isGetUidError: true, message: "Try again in a few seconds!" });
			}
			return Promise.reject({ isGetUidError: true, message: response.data });
		}
		if (platform == "PC") { // PC players have to be separated because the data that is returned is different for them
			if (JSONBigInt.parse(response.data).uid == undefined) { // This is to check if an user was returned or not. Because the API doesn't throw an Error if no user exists.
				logger.error(new Error(response.data), { module: "getUserUID", guildID: guildID, discordID: discordID, data: response.data, IGN: IGN, platform: platform });
				return Promise.reject({ isGetUidError: true, message: "Error: Unknown user! Please use Origin username!" });
			}
			logger.info("ALS API data fetched user PC!", { module: "getUserUID", guildID: guildID, discordID: discordID, data: response.data, IGN: IGN, platform: platform });
			return JSONBigInt.parse(response.data).uid;
		}
		logger.info("API data fetched user console!", { module: "getUserUID", guildID: guildID, discordID: discordID, data: response.data, IGN: IGN, platform: platform });
		return JSONBigInt.parse(response.data).result;
	}
	catch (error) {
		// Can't use catch because the API doesn't throw any Errors even if there is one.
	}

}
/**
 * @param  {string} UID User UID
 * @param  {string} platform User platform
 * @param  {string} guildID GuildID where the command was ran
 * @param  {string} discordID User discordID
 * @return {string} User IGN
 */
async function UIDToIGN(UID, platform, guildID, discordID) {
	try {
		const data = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}&skipRank=true`));
		logger.info("ALS API fetched user!", { module: "UIDToIGN", guildID: guildID, discordID: discordID, IGN: data.data.global.name, UID: UID, platform: platform });
		return data.data.global.name;
	}
	catch (error) {
		if (error.response) {
			logger.error(new Error(error), { module: "UIDToIGN", guildID: guildID });
		}
		if (error) {
			logger.error(new Error(error), { module: "UIDToIGN", guildID: guildID });
		}
	}
}

module.exports = {
	getUserUID,
	UIDToIGN,
};