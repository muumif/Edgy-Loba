const firebase = require("firebase/app");
require("dotenv").config()
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
        }else{return Promise.reject("Guild does not exist in the database!")}
    }).catch((error) => {
        return Promise.reject(error);
    });
}

async function getUser(guildID, userID){
    return await get(child(dbRef, "gulds/" + guildID + "/users/" + userID))
    .then((snapshot) => {
        if(snapshot.exists()){
            return snapshot;
        }else{return Promise.reject("User or guild does not exist in the database!")}
    }).catch((error) => {
        return Promise.reject(error);
    });
}

async function getUserHistory(guildID, userID){
    let dates = [], rps = [];
    return await get(child(dbRef, "guilds/" + guildID + "/history/" + userID))
    .then((snapshot) => {
        if(snapshot.exists){
            console.log(snapshot.val());
            snapshot.forEach(function (data) {
                dates.push(data.val().date);
                rps.push(data.val().rp);
            });

            let history = dates.map(function(a,b) {return [a, rps[b]]});
            return history;
        }else{return Promise.reject("User or guild does not exist in the database!")}
    }).catch((error) => {
        return Promise.reject(error);
    });
}

module.exports = {
    getAllGuildUsers,
    getUser,
    getUserHistory
}