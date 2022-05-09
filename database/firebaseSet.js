const firebase = require("firebase/app");
require("dotenv").config();
const { set, ref, getDatabase, child } = require("firebase/database");

const firebaseConfig = {
	apiKey: process.env.FIREBASE_APIKEY,
	authDomain: "edgyloba.firebaseapp.com",
	databaseURL: "https://edgyloba-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "edgyloba",
	storageBucket: "edgyloba.appspot.com",
	messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
	appId: process.env.FIREBASE_APPID,
};

const app = firebase.initializeApp(firebaseConfig);
const dbRef = getDatabase(app);

function writeUserData(guildID, userID, UID, rp, platform) {
	set(ref(dbRef, "guilds/" + guildID + "/users/" + userID), {
		discordID: `${userID}`,
		originUID: UID,
		RP: rp,
		platform: platform,
	});
}

function deleteUserData(guildID, userID) {
	set(ref(dbRef, "guilds/" + guildID + "/users/" + userID), null);
}

function writeHistoryData(guildID, userID, rp) {
	const today = new Date();
	const date = today.getUTCDate() + "-" + (today.getUTCMonth() + 1) + "-" + today.getUTCFullYear();

	set(child(ref(dbRef), "guilds/" + guildID + "/history/" + userID + "/" + date), {
		date: date,
		rp: rp,
	});
}

module.exports = {
	writeUserData,
	deleteUserData,
	writeHistoryData,
};