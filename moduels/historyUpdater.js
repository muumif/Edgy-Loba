const cron = require("node-cron");
const { insertHistoryData, getAllUsers } = require("../database/db");
const axios = require("axios");
const { logger } = require("./logger");

async function getData(UID, platform, onUser, totalUsers) {
	const URI = `${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}`;
	return axios.get(encodeURI(URI))
		.then(function(response) {
			logger.info("API fetched user!", { module: "historyUpdater", UID: UID, platform: platform, onUser: onUser + 1, totalUsers: totalUsers });
			return response;
		}).catch(function(error) {
			switch (error.response.status) {
			case 400:
				return logger.error(new Error(error), { module: "historyUpdater", UID: UID, platform: platform, onUser: onUser + 1, totalUsers: totalUsers });
			case 403:
				return logger.error(new Error(error), { module: "historyUpdater", UID: UID, platform: platform, onUser: onUser + 1, totalUsers: totalUsers });
			case 404:
				return logger.error(new Error(error), { module: "historyUpdater", UID: UID, platform: platform, onUser: onUser + 1, totalUsers: totalUsers });
			case 405:
				return logger.error(new Error(error), { module: "historyUpdater", UID: UID, platform: platform, onUser: onUser + 1, totalUsers: totalUsers });
			case 410:
				return logger.error(new Error(error), { module: "historyUpdater", UID: UID, platform: platform, onUser: onUser + 1, totalUsers: totalUsers });
			case 429:
				return logger.error(new Error(error), { module: "historyUpdater", UID: UID, platform: platform, onUser: onUser + 1, totalUsers: totalUsers });
			case 500:
				return logger.error(new Error(error), { module: "historyUpdater", UID: UID, platform: platform, onUser: onUser + 1, totalUsers: totalUsers });
			}
		});
}


async function importAllUsers() {
	let allUsers = [];
	await getAllUsers().then(_allUsers => {
		allUsers = _allUsers;
	});

	const insertData = async _ => {
		for (let i = 0; i < allUsers.length; i++) {
			await getData(allUsers[i].originUID, allUsers[i].platform, i, allUsers.length).then(async result => {
				await insertHistoryData(allUsers[i].discordID, result.data.global.rank.rankScore, result.data.global.arena.rankScore);
			});
		}
	};

	await insertData();
}

module.exports = () => {
	cron.schedule("59 23 * * *", async function() {
		logger.info("History search started!", { module: "historyUpdater" });
		importAllUsers();
	});
};