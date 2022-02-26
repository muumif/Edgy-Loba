const Discord = require('discord.js');
const config = require('./config.json');
const https = require('follow-redirects').https;
const db = require('quick.db');
const axios = require('axios');

const client = new Discord.Client();
const prefix = config.prefix;

client.once('ready', () => {
    console.log('Edgy Loba is now online!');
    client.user.setPresence({ activity: { name: '!hl || Checking the stats!' }, status: 'online' })
})

function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
}

client.on('message', async message => {

    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "hl"){

        const embed = new Discord.MessageEmbed()
        .setTitle("Help/Commands")
        .setDescription("A list of commands for Edgy Loba!")
        .setColor("#e3a600")
        .addFields(
            {
                name:"__!hl__",
                value:"The help command.\n***Usage: !hl***",
                inline: true
            },
            {
                name:"__!link__",
                value:"Link your discord account to your Apex one.\n***Usage: !link (Apex username)***",
                inline: true
            },
            {
                name:"__!unlink__",
                value:"Unlink your discord account from your Apex one.\n***Usage: !unlink***",
                inline: true
            }
        )
        .addFields(
            {
                name:"__!stats__",
                value:"Check your own or someone elses Apex stats.\n***Usage: !stats or !stats (Apex username)***",
                inline: true
            },
            {
                name:"__!top__",
                value:"Show the Apex leaderboard for this server.\n***Usage: !top***",
                inline: true
            }
        )
        message.channel.send({embed});
    }

    if (command == "link"){
        if(db.has(`${message.author.id}`)){
            const embed = new Discord.MessageEmbed()
            .setTitle("Username already linked!")
            .setDescription("If you wish to unlink your username type **!unlink**")
            .setColor("#e3a600");
            return message.channel.send({embed});
        }
        if(args[0] == undefined){
            const embed = new Discord.MessageEmbed()
            .setTitle("Wrong format!")
            .setDescription("Correct way: **!link (Apex username) (pc/ps4/x1)**")
            .setColor("#e3a600");
            return message.channel.send({embed});
        }
        if(args[1] == undefined){
            const embed = new Discord.MessageEmbed()
            .setTitle("Wrong format!")
            .setDescription(`Correct way: **!link ${args[0]} (pc/ps4/x1)**`)
            .setColor("#e3a600");
            return message.channel.send({embed});
        }
        var username = args[0];
        var platform = args[1].toUpperCase();
        setTimeout(async () => {
            const URI = `https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${username}&auth=${config.ALS_Token}`;
            const encodedURI = encodeURI(URI);
            const response = await axios.get(encodedURI)
            .then(function (response){
            db.set(`${message.author.id}`, { username: `${args[0]}`, platform: `${args[1]}`});
            const embed = new Discord.MessageEmbed()
            .setTitle("Username successfully linked!")
            .setDescription(`${message.author} linked to **${username} using ${platform}**`)
            .setColor("#e3a600");
              message.channel.send({embed});
              message.channel.stopTyping();
            })
  
            .catch(function(error){
                if(error.response){
                  message.channel.send("Error: " + error.response.data.Error)
                  message.channel.stopTyping();
                }
            });
          }, 250);
    }

    if (command === "unlink"){
        if(!db.has(`${message.author.id}`)){
            const embed = new Discord.MessageEmbed()
            .setTitle("You don't have any linked usernames!")
            .setDescription("You can set your username: **!link (Apex username)**")
            .setColor("#e3a600");
            return message.channel.send({embed})
        }
        db.delete(`${message.author.id}`);
        const embed = new Discord.MessageEmbed()
        .setTitle("Username has been unlinked!")
        .setColor("#e3a600");
        return message.channel.send({embed});
    }

    if (command === "stats")
    {
        var username;
        var platform;

        if (args[0] == undefined){
            if(!db.has(`${message.author.id}`)){
                return message.channel.send("No username given or has been linked!"); // Todo embed
            }
            username = db.get(`${message.author.id}.username`);
        }else(username = args[0])

        if (args[1] == undefined){
            if(!db.has(`${message.author.id}`)){
                return message.channel.send("No platform give!"); // TOdo embed
            }
            platform = db.get(`${message.author.id}.platform`);
        }else{platform = args[1]};

        message.channel.startTyping();

        setTimeout(async () => {
          const URI = `https://api.mozambiquehe.re/bridge?version=5&platform=${platform.toUpperCase()}&player=${username}&auth=${config.ALS_Token}`;
          const encodedURI = encodeURI(URI);
          const response = await axios.get(encodedURI)
          .then(function (response){
            const embed = new Discord.MessageEmbed()
            .setTitle("Stats for " + response.data.global.name)
            .setThumbnail(response.data.global.rank.rankImg)
            .addFields(
                {
                    name: "__Level__",
                    value: response.data.global.level,
                    inline: true
                },
                {
                    name: "__Rank__",
                    value: response.data.global.rank.rankName + " " + response.data.global.rank.rankDiv,
                    inline: true
                },
                {
                    name: "__RP__",
                    value: response.data.global.rank.rankScore,
                    inline: true
                }
            )
            .setColor("#e3a600");
            message.channel.send({embed});
            message.channel.stopTyping();
            if(db.has(`${message.author.id}`)){
                db.set(`${message.author.id}.RP`, `${response.data.global.rank.rankScore}`);
            }
          })

          .catch(function(error){
              if(error.response){
                message.channel.send("Error: " + error.response.data.Error)
                message.channel.stopTyping();
              }
          });
        }, 250);
    }

    if(command === "top"){
        message.channel.startTyping();

        for (let i = 0; i < db.all().length; i++) {
            setTimeout(async () => {
              const URI = `https://api.mozambiquehe.re/bridge?version=5&platform=${db.all()[i].data.platform.toUpperCase()}&player=${db.all()[i].data.username}&auth=${config.ALS_Token}`;
              const encodedURI = encodeURI(URI);
              const response = await axios.get(encodedURI)
              .then(function (response){
                db.set(`${db.all()[i].ID}.RP`, `${response.data.global.rank.rankScore}`);
                message.channel.stopTyping();
              })
    
              .catch(function(error){
                  if(error.response){
                    message.channel.send("Error: " + error.response.data.Error)
                    message.channel.stopTyping();
                  }
              });
            }, 250);
        }

        var sortedData = db.all().sort((a, b) => (a.data.RP < b.data.RP) ? 1 : -1)
        const embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setColor("#e3a600");
        for(var i = 0, count = 1; i < sortedData.length; i++){
            embed.addField(
                count + ". " + sortedData[i].data.username,
                sortedData[i].data.RP + " RP",
                false 
            );
            count++;
        }
        message.channel.send({embed});
        message.channel.stopTyping();

    }
});

client.login(config.token);