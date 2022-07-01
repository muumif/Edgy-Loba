const cron = require("node-cron");
const { insertHistoryData, getAllUsers } = require("./db");
const axios = require("axios");
const { logger } = require("./logger");
const { unlink, readdir } = require("fs");
const path = require("path");

async function historyUpdater() {
	try {
		const users = await getAllUsers();

		for (let i = 0; i < users.length; i++) {
			const user = await axios.get(encodeURI(`${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${users[i].originUID}&platform=${users[i].platform}`));
			await insertHistoryData(users[i].discordID, user.data.global.rank.rankScore, user.data.global.arena.rankScore);
		}

	}
	catch (error) {
		if (error.response) {
			return logger.error(new Error(error), { module: "historyUpdater" });
		}
		if (error) {
			return logger.error(new Error(error), { module: "historyUpdater" });
		}
	}
}

function deleteHistory() {
	try {
		const tempPath = path.join("../../temp");
		const files = readdir(tempPath);
		files.forEach(file => {
			if (file.includes("history")) {
				unlink(`${tempPath}/${file}`, err => {
					if (err) {throw err;}
					else {logger.info("Deleting TEMP history images!", { module: "deleteHistory" });}
				});
			}
		});

	}
	catch (error) {
		return logger.error(new Error(error), { module: "deleteHistory" });
	}
}

async function deleteTop() {
	try {
		const tempPath = path.join();
		const files = readdir(tempPath);
		files.forEach(file => {
			if (file.includes("top")) {
				unlink(`${tempPath}/${file}`, err => {
					if (err) {throw err;}
					else {logger.info("Deleting TEMP top images!", { module: "deleteTop" });}
				});
			}
		});

	}
	catch (error) {
		return logger.error(new Error(error), { module: "deleteTop" });
	}
}


module.exports = () => {
	cron.schedule("55 23 * * *", async function() {
		logger.info("History updating started!", { module: "historyUpdater" });
		await historyUpdater();
	});

	cron.schedule("00 00 * * *", function() {
		deleteHistory();
	});

	cron.schedule("00 */6 * * *", async function() {
		deleteTop();
	});
};