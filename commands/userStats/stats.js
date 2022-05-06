//TODO: This
const Discord = require("discord.js");
const axios = require("axios");
const { getUser } = require("../../database/firebaseGet");
const { getUserUID } = require("../../moduels/getUID");
require("dotenv").config();

async function getUserData(UID, platform) {

}

async function makeStatsEmbed(IGN, platform, guildID, userID) {
	if (IGN == undefined) {
		getUserUID(guildID, userID).then(snapshot => {
			if (snapshot.exists) {
				//TODO:
			}
		});
	}
	const originUID = await getUserUID(IGN, platform);

	console.log(originUID);
}

module.exports = {
	makeStatsEmbed,
};