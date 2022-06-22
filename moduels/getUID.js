const axios = require("axios");
require("dotenv").config();
const { logger } = require("./logger");
const JSONBigInt = require("json-bigint")({ "storeAsString": true });


async function getUserUID(IGN, platform, guildID, discordID) {
	try {
		const response = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/nametouid?auth=${process.env.ALS_TOKEN}&player=${IGN}&platform=${platform}`), { transformResponse: [data => data] });
		if (response.data.includes("Error")) {
			logger.error(new Error(response.data), { module: "getUID", guildID: guildID, discordID: discordID, data: response.data, IGN: IGN, platform: platform });
			return Promise.reject({ isGetUidError: true, message: response.data });
		}
		if (platform == "PC") {
			if (JSONBigInt.parse(response.data).uid == undefined) {
				logger.error(new Error(response.data), { module: "getUID", guildID: guildID, discordID: discordID, data: response.data, IGN: IGN, platform: platform });
				return Promise.reject({ isGetUidError: true, message: "Error: Unknown user! Please use Origin username!" });
			}
			logger.info("ALS API data fetched user PC!", { module: "getUID", guildID: guildID, discordID: discordID, data: response.data, IGN: IGN, platform: platform });
			return JSONBigInt.parse(response.data).uid;
		}
		logger.info("API data fetched user console!", { module: "getUID", guildID: guildID, discordID: discordID, data: response.data, IGN: IGN, platform: platform });
		return JSONBigInt.parse(response.data).result;
	}
	catch (error) {
		//Cant do anything until new headears from the API if statment error checking
	}

}

module.exports = {
	getUserUID,
};