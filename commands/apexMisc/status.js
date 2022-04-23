const axios  = require("axios");
const Discord = require('discord.js');
require("dotenv").config()

async function getData(){
    let data;
    const URI = `${process.env.ALS_ENDPOINT}/servers?auth=${process.env.ALS_TOKEN}`;
    await axios.get(encodeURI(URI))
    .then(function (response){
            data = response;
    }).catch((error) => {
        console.log(error); //Deal with this maybe write to db as a log
    });
    
    return data;
}

async function makeStatusEmbed(){
    return getData().then(result => {
        const embed = new Discord.MessageEmbed()
        .setTitle("Server Status")
        .setDescription("Data from apexlegendsstatus.com")
        .addFields(
            {
                name: ":flag_eu: EU-West",
                value: "Status: " + result.data.EA_novafusion["EU-West"].Status + "\nPing: " + result.data.EA_novafusion["EU-West"].ResponseTime,
                inline: true
            },
            {
                name: ":flag_eu: EU-East",
                value: "Status: " + result.data.EA_novafusion["EU-East"].Status + "\nPing: " + result.data.EA_novafusion["EU-East"].ResponseTime,
                inline: true
            },
            {
                name: ":flag_us: US-West",
                value: "Status: " + result.data.EA_novafusion["US-West"].Status + "\nPing: " + result.data.EA_novafusion["US-West"].ResponseTime,
                inline: true
            },
            {
                name: ":flag_us: US-Central",
                value: "Status: " + result.data.EA_novafusion["US-Central"].Status + "\nPing: " + result.data.EA_novafusion["US-Central"].ResponseTime,
                inline: true
            },
            {
                name: ":flag_us: US-East",
                value: "Status: " + result.data.EA_novafusion["EU-East"].Status + "\nPing: " + result.data.EA_novafusion["EU-East"].ResponseTime,
                inline: true
            },
            {
                name: ":flag_br: South America",
                value: "Status: " + result.data.EA_novafusion.SouthAmerica.Status + "\nPing: " + result.data.EA_novafusion.SouthAmerica.ResponseTime,
                inline: true
            },
            {
                name: ":flag_jp: Asia",
                value:"Status: " + result.data.EA_novafusion.Asia.Status + "\nPing: " + result.data.EA_novafusion.Asia.ResponseTime,
                inline: true
            }
        )
        .setColor("#e3a600");
        return embed;
    });
}

module.exports = {
    makeStatusEmbed
}