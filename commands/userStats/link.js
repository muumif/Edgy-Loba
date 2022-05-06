const Discord = require('discord.js');
const axios = require('axios');
const { getUser } = require('../../database/firebaseGet');
const { writeUserData, writeHistoryData } = require('../../database/firebaseSet');
const { getUserUID } = require('../../moduels/getUID');
require("dotenv").config();

async function verifyUser(){
    //TODO: Verifying that the user is acctualy who they claim to be
}

async function makeLinkEmbed(IGN, platform, guildID, userID, messageAuthor){
    return getUser(guildID, userID).then(snapshot => {
        if(snapshot.exists()){
            const embed = new Discord.MessageEmbed()
            .setTitle("Username already linked!")
            .setDescription("Use command **>unlink** to unlink your account! \nAccount needs to be verified again when unlinked!")
            .setColor("#e3a600")
            return embed; 
        }else{
            if(IGN == undefined){
                const embed = new Discord.MessageEmbed()
                .setTitle("No username given!")
                .setDescription(">link **[Apex IGN] [PC | xbox | playstation | switch]**")
                .setColor("#e3a600");
                return embed;
            }
            if(platform == undefined){
                const embed = new Discord.MessageEmbed()
                .setTitle("No platform given")
                .setDescription(`>link **${IGN} [PC | xbox | Playstation | Switch]**`)
                .setColor("#e3a600");
                return embed;
            }
        }

        if(platform == "pc" || platform == "ORIGIN" || platform == "origin"){
            platform = "PC";
        }
        if(platform == "x" || platform == "X" || platform == "xbox" || platform == "XBOX" || platform == "x1"){
            platform = "X1";
        }
        if(platform == "ps" || platform == "PS" || platform == "playstation" || platform == "PLAYSTATION" || platform == "ps4" || platform == "PS4" || platform == "ps5" || platform == "PS5"){
            platform = "PS4";
        }
        if(platform == "switch" || platform == "nintendo" || platform == "NINTENDO"){
            platform = "SWITCH";
        }

        return getUserUID(IGN, platform).then(UID => {
            const URI = `${process.env.ALS_ENDPOINT}/bridge?auth=${process.env.ALS_TOKEN}&uid=${UID}&platform=${platform}`;
            return axios.get(encodeURI(URI))
            .then(function(response){
                writeUserData(guildID, userID, UID, response.data.global.rank.rankScore, platform);
                writeHistoryData(guildID, userID, response.data.global.rank.rankScore);

                const embed = new Discord.MessageEmbed()
                .setTitle("IGN has been successfully linked!")
                .setDescription(`${messageAuthor} linked to **${response.data.global.name}** using **${platform}**`)
                .setColor("#e3a600");
                return embed;
            }).catch(function(error){
                console.log(error)
                return Promise.reject(error);
            })
        })
    }).catch((error) => {
        const embed = new Discord.MessageEmbed()
        .setTitle("Error")
        .setDescription(error.response.data)
        .setColor("#e3a600");
        return Promise.reject(embed);
    });
}

module.exports = {
    makeLinkEmbed
}