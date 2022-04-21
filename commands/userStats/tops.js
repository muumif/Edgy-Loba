const Discord = require('discord.js');
const { getAllGuildUsers } = require("../../database/firebaseGet");
require("dotenv").config();


async function makeTopEmbed(guildID){ //Make chart for all the users
    let sortedArray = [];

    const embed = new Discord.MessageEmbed()
    .setTitle("Leaderboard")
    .setColor("#e3a600");

    await getAllGuildUsers(guildID).then(snapshot => {
        snapshot.forEach(function(_child){
            sortedArray.push(_child.val());
        });
        sortedArray.sort((a,b) => {return b.RP - a.RP});
    });

    for(i = 0, count = 1; i < sortedArray.length; i++){
        embed.addField(count + ". " + sortedArray[i].username, "RP: " + sortedArray[i].RP, false);
        count++;
    }

    return embed;

}

function makeGTopEmbed(){
    //Todo global top 
}


module.exports = {
    makeTopEmbed,
    makeGTopEmbed
}