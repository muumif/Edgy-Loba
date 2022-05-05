const axios  = require("axios");
const Discord = require('discord.js');
require("dotenv").config()

async function getData(){
    const URI = `${process.env.ALS_ENDPOINT}/maprotation?version=2&auth=${process.env.ALS_TOKEN}`;
    return await axios.get(encodeURI(URI))
    .then(function (response){
            return response;
    }).catch((error) => {
        return Promise.reject(error);
    });
}

async function makeMapEmbed(){
    return getData().then(result => {
        const embed = new Discord.MessageEmbed()
        .setTitle("Map Rotation")
        .addFields(
           {
                name: "__Battle Royale__",
                value: `Current map: **${result.data.battle_royale.current.map}**\nNext Map: **${result.data.battle_royale.next.map}**\nRemaining: **${result.data.battle_royale.current.remainingMins} min**`,
                inline: true
            },
            {
                name: "__Arenas__",
                value: `Current map: **${result.data.arenas.current.map}**\nNext Map: **${result.data.arenas.next.map}**\nRemaining: **${result.data.arenas.current.remainingMins} min**`,
                inline: true
            },
            {
                name: "__Arenas Ranked__",
                value: `Current map: **${result.data.arenasRanked.current.map}**\nNext Map: **${result.data.arenasRanked.next.map}**\nRemaining: **${result.data.arenasRanked.current.remainingMins} min**`,
                inline: true
            }
        )
        .setImage(result.data.battle_royale.current.asset)
        .setColor("#e3a600");
        return embed;
    });
}

module.exports = {
    makeMapEmbed
}