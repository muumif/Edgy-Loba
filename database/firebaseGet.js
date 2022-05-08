const firebase = require("firebase/app");
require("dotenv").config();
const { getDatabase, ref, get, child } = require("firebase/database");
const Discord = require("discord.js");

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
const dbRef = ref(getDatabase(app));

async function getAllGuildUsers(guildID) {
	return await get(child(dbRef, "guilds/" + guildID + "/users/"))
		.then(snapshot => {
			return snapshot;
		}).catch(error => {
			console.log(error);
			return new Discord.MessageEmbed().setTitle("An unknown error accured!").setColor("#e3a600");
		});
}

async function getUser(guildID, userID) {
	return await get(child(dbRef, "guilds/" + guildID + "/users/" + userID))
		.then(snapshot => {
			return snapshot;
		}).catch(error => {
			console.log(error);
			return new Discord.MessageEmbed().setTitle("An unknown error accured!").setColor("#e3a600");
		});
}

async function getUserHistory(guildID, userID) {
	const dates = [], rps = [];
	return await get(child(dbRef, "guilds/" + guildID + "/history/" + userID))
		.then(snapshot => {
			if (snapshot.exists) {
				snapshot.forEach(function(data) {
					dates.push(data.val().date);
					rps.push(data.val().rp);
				});

				const history = dates.map(function(a, b) {return [a, rps[b]];});
				return history;
			}
		}).catch(error => {
			console.log(error);
			return new Discord.MessageEmbed().setTitle("An unknown error accured!").setColor("#e3a600");
		});
}

module.exports = {
	getAllGuildUsers,
	getUser,
	getUserHistory,
};