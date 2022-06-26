const axios = require("axios");
require("dotenv").config();
const { logger } = require("./internal/logger");
const JSONBigInt = require("json-bigint")({ "storeAsString": true });


async function getUserUID(IGN, platform, guildID, discordID) {
	try {
		const response = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`), { transformResponse: [data => data] });
		if (response.data.includes("Error")) {
			logger.error(new Error(response.data), { module: "getUserUID", guildID: guildID, discordID: discordID, data: response.data, IGN: IGN, platform: platform });
			if (response.data.includes("Slow down !")) {
				return Promise.reject({ isGetUidError: true, message: "Try again in a few seconds!" });
			}
			return Promise.reject({ isGetUidError: true, message: response.data });
		}
		if (platform == "PC") {
			if (JSONBigInt.parse(response.data).uid == undefined) {
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
		//Cant do anything until new headears from the API if statment error checking
	}

}
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