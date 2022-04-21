const firebase = require("firebase/app");
require("dotenv").config();
const { getDatabase, ref, get, child } = require('firebase/database');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: "edgyloba.firebaseapp.com",
    databaseURL: "https://edgyloba-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "edgyloba",
    storageBucket: "edgyloba.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID
}

const app = firebase.initializeApp(firebaseConfig);
const dbRef = ref(getDatabase(app));

async function getAllGuildUsers(guildID){
    return await get(child(dbRef, "guilds/" + guildID + "/users"))
    .then((snapshot) => {
        if(snapshot.exists()){
            return snapshot;
        }
    }).catch((error) => {
        return error;
    });
}

module.exports = {
    getAllGuildUsers
}