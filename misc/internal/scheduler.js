/**
 * @file Manages all time related updating and data deleting.
 * @author muumif
 * @version 1.0.0
*/

const { insertHistoryData, getAllUsers } = require("./db");
const { logger } = require("./logger");
const { unlink, readdir } = require("fs");
const path = require("path");
const cron = require("node-cron");
const axios = require("axios");
const tempPath = "../../temp";

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
		readdir(tempPath, (err, data) => { // Read temp directory
			if (err) throw err;
			data.forEach(file => { // Loop through each file in the directory
				if (file.includes("history")) { // If the file contains history
					unlink(`${tempPath}/${file}`, err => { // Delete the file that contains history
						if (err) {throw err;}
						else {logger.info("Deleting TEMP history images!", { module: "deleteHistory" });}
					});
				}
			});
		});
	}
	catch (error) {
		return logger.error(new Error(error), { module: "deleteHistory" });
	}
}

async function deleteTop() {
	try {
		readdir(tempPath, (err, data) => { // Read temp directory
			if (err) {throw err;}
			data.forEach(file => { // Loop through each file in the directory
				if (file.includes("top")) { // If the file contains top
					unlink(`${tempPath}/${file}`, err => { // Delete the file that contains top
						if (err) {throw err;}
						else {logger.info("Deleting TEMP top images!", { module: "deleteTop" });}
					});
				}
			});
		});
	}
	catch (error) {
		return logger.error(error, { module: "deleteTop" });
	}
}

module.exports = () => {
	cron.schedule("55 23 * * *", async function() { // Runs historyUpdater at 23:55 UTC
		logger.info("History updating started!", { module: "historyUpdater" });
		await historyUpdater();
	});

	cron.schedule("0 0 * * *", function() { // Runs deleteHistory at 00:00 UTC
		deleteHistory();
	});

	cron.schedule("0 */2 * * *", async function() { // Runs deleteTop every 2 hours
		deleteTop();
	});
};