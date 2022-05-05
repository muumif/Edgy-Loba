const Discord = require('discord.js');
const { getAllGuildUsers } = require('../../database/firebaseGet');
require("dotenv").config();

const client = new Discord.Client();

async function fetchUser(id){
    return await client.users.fetch(id).then(result =>{
        return result;
    });
}

async function getData(guildID){
    return await getAllGuildUsers(guildID).then(result => {
        let allUsers = [];
        result.forEach(function(_child){
            allUsers.push(_child.val());
        })
        allUsers.sort((a,b) => {return b.RP - a.RP});

        return allUsers;
    }).catch((error) => {
        return Promise.reject(error);
    });
}

async function makeTopEmbed(guildID){ 
    return await getData(guildID).then(result => {
        const embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setColor("#e3a600");
        
        const discordIDToName = async _ => {
            for(let i = 0; i < result.length; i++){
                let fetch = await fetchUser(result[i].discordID);
                result[i].discordName = fetch.username;
                result[i].discordDiscriminator = fetch.discriminator;
                result[i].discordImg = fetch.avatarURL();
            }

            for (let j = 0, count = 1; j < result.length; j++) {
                embed.addField(count + ". " + result[j].username + " / " + result[j].discordName + "#" + result[j].discordDiscriminator, "RP: " + result[j].RP , false);
                count++;
            }

            embed.setThumbnail(result[0].discordImg);

            return embed;
        }

        return discordIDToName().then(embed => {
            return embed;
        })
        
    }).catch((error) => {
        return Promise.reject(error);
    });
}

module.exports = {
    makeTopEmbed
}