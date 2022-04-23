const Discord = require('discord.js');
const { getAllGuildUsers } = require('../../database/firebaseGet');
require("dotenv").config();

async function makeTopEmbed(guildID){ 
    let allUsers = [];
    return await getAllGuildUsers(guildID).then(results =>{
        const embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setColor("#e3a600");

        results.forEach(function(_child){
            allUsers.push(_child.val());
        });

        allUsers.sort((a,b) => {return b.RP - a.RP;});

        for(i = 0, count = 1; i < allUsers.length; i++){
            embed.addField(count + ". " + allUsers[i].username, "RP: " + allUsers[i].RP, false);
            count++;
        }

        return embed;
    })
}

function makeGTopEmbed(){
    //Todo global top 
}


module.exports = {
    makeTopEmbed,
    makeGTopEmbed
}