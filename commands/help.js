const Discord = require('discord.js');
require("dotenv").config()

async function makeHelpEmbed(){
    const embed = new Discord.MessageEmbed()
    .setTitle("Help/Commands")
    .setColor("#e3a600")
    .addFields(
        {
            name: "__>link [Apex IGN] [PC/X1/PS4]__",
            value: "Link your discord account to your Apex user. Doing this allows you to see history graphs collaborate in the leaderboard and much more.",
            inline: true
        },
        {
            name: "__>unlink__",
            value: "Unlink your discord account from you Apex user.",
            inline: true
        },
        {
            name: "__>stats [Optional: Apex IGN] [Optional: PC/X1/PS4]__",
            value: "Shows Apex stats. If you have a linked account you dont have to insert your Apex IGN to check your own stats.",
            inline: true
        }, 
        {
            name: "__>top__",
            value: "Shows the current leaderboard for this server.",
            inline: true
        },
        {
            name: "__>map__",
            value: "Shows the current and next maps for Apex, Battle Royale and Arenas mode also the time remaining till next map.",
            inline: true
        },
        {
            name: "__>status__",
            value: "Shows the server status of Lobby/Matchmaking servers by region.",
            inline: true
        }
    );

    return embed;
}


module.exports = {
    makeHelpEmbed
}

//TODO: Document every command with comments or whatever