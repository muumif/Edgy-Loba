const cron = require("node-cron");
const { insertHistoryData, getAllUsers } = require("../database/db");
const axios = require("axios");

async function getData(UID, platform) {
	const URI = `${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}`;
	return axios.get(encodeURI(URI))
		.then(function(response) {
			return response;
		}).catch(function(error) {
			switch (error.response.status) {
			case 400:
				return Promise.reject("Something went wrong. Try again in a few minutes.");
			case 403:
				return Promise.reject("Unauthorized / Unknown API key");
			case 404:
				return Promise.reject("Player could not be found.");
			case 405:
				return Promise.reject("External API error.");
			case 410:
				return Promise.reject("Unknown platform provided.");
			case 429:
				return Promise.reject("API Rate limit reached.");
			case 500:
				return Promise.reject("API Internal error.");
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
			await getData(allUsers[i].originUID, allUsers[i].platform).then(async result => {
				await insertHistoryData(allUsers[i].discordID, result.data.global.rank.rankScore, result.data.global.arena.rankScore);
			});
		}
	};

	await insertData();
}

module.exports = () => {
	cron.schedule("59 23 * * *", async function() {
		importAllUsers();
	});
};