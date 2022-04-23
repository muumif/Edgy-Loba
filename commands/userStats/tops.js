const Discord = require('discord.js');
const { getUserHistoryData } = require('../../database/firebaseGet');
require("dotenv").config();


async function getTopHistoryData(guildID, userID){
    return await getUserHistoryData().then(result => {
        let history = result;
        for (let i = 0; i < history.length; i++) {
            history[i][0] = history[i][0].split("-").reverse().join("/");     
        }
        
        history.sort(function (a,b) {
            var dateA = new Date(a[0]), dateB = new Date(b[0]);
            return dateA - dateB;
        });
    
        console.log(history);
    }).catch((error) => {
        return Promise.reject(error);
    })
}


async function makeTopEmbed(guildID, userID){ 
    getUserHistoryData(guildID, userID);
}

function makeGTopEmbed(){
    //Todo global top 
}


module.exports = {
    makeTopEmbed,
    makeGTopEmbed
}