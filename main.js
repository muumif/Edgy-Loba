const Discord = require('discord.js');
const config = require('./config.json');
const https = require('follow-redirects').https;
const db = require('quick.db');
const client = new Discord.Client();
const prefix = config.prefix;

client.once('ready', () => {
    console.log('Edgy Loba is now online!');
    client.user.setPresence({ activity: { name: '!hl || Checking the stats!' }, status: 'online' })
})

function inRange(x, min, max) {
    return ((x-min)*(x-max) <= 0);
}

client.on('message', message => {

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

    if (command === 'link') {
        var messageAuthor = message.author.id;
        if(!args.length){
            const embed = new Discord.MessageEmbed()
            .setTitle("Wrong format!")
            .setDescription("Correct way: **!link (Apex username)**")
            .setColor("#e3a600");
            return message.channel.send({embed});
        }
        if(db.has(`${messageAuthor}`)){
            const embed = new Discord.MessageEmbed()
            .setTitle("Username already linked!")
            .setDescription("If you wish to unlink your username type **!unlink**")
            .setColor("#e3a600");
            return message.channel.send({embed});
        }
        db.set(`${messageAuthor}`, { user: `${args[0]}`});
        const embed = new Discord.MessageEmbed()
        .setTitle("Username successfully linked!")
        .setDescription(`${messageAuthor} linked to **${args[0]}**`)
        .setColor("#e3a600");
        return message.channel.send({embed});
    }

    if (command === "unlink"){
        var messageAuthor = message.author.id;

        if(!db.has(`${messageAuthor}`)){
            const embed = new Discord.MessageEmbed()
            .setTitle("You don't have any linked usernames!")
            .setDescription("You can set your username: **!link (Apex username)**")
            .setFooter("Edgy Loba", "https://cdn.discordapp.com/avatars/719542118955090011/41d9ec9fcb2a5d9d4854ad702866c365.png")
            .setColor("#e3a600");
            return message.channel.send({embed})
        }
        db.delete(`${messageAuthor}`);
        const embed = new Discord.MessageEmbed()
        .setTitle("Username has been unlinked!")
        .setColor("#e3a600");
        return message.channel.send({embed});
    }

    if (command === "stats")
    {
        let messageAuthor = message.author.id;
        var username;
        if(args[0] != undefined){
            username = args[0];
        }else{username = db.get(`${messageAuthor}.user`);}
        var platform = "origin";
        if(args[1] != undefined){
            platform = args[1];
        }
        var url = `https://public-api.tracker.gg/v2/apex/standard/profile/${platform}/${username}`;
        
        var name, RankedPoints, level, rank;
        
        https.get(url, {
            headers: {
                "TRN-Api-Key" : config.TRN_Token
            }
        }, function (res) {
          
            var data = '';
            res.on('data', function (chunk) {
                data += chunk.toString();
            });
            res.on('end', function () { 
                
                var json; 
        
                try {             
                    json = JSON.parse(data);
                    name = username;
                    level = json.data.segments[0].stats.level.value;
                    RankedPoints = json.data.segments[0].stats.rankScore.value;
                    
                    //#region ranks
                    //In range bronze

                    let member = message.guild.member(message.author);
                    if(inRange(RankedPoints, 0, 1200) === true){

                        if(inRange(RankedPoints, 0, 300)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 300, 600)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 600, 900)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 900, 1200)){
                            rankNr = " 1";
                        }
                        rank = "Bronze" + rankNr;
                    }
                    //In range silver
                    if(inRange(RankedPoints, 1200, 2800) === true){

                        if(inRange(RankedPoints, 1200, 1600)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 1600, 2000)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 2000, 2400)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 2400, 2800)){
                            rankNr = " 1";
                        }
                        rank = "Silver";
                    }
                    //In range gold
                    if(inRange(RankedPoints, 2800, 4800) === true){

                        if(inRange(RankedPoints, 2800, 3300)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 3300, 3800)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 3800, 4300)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 4300, 4800)){
                            rankNr = " 1";
                        }

                        rank = "Gold" + rankNr;
                    }
                    //In range platinum
                    if(inRange(RankedPoints, 4800, 7200) === true){

                        if(inRange(RankedPoints, 4800, 5400)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 5400, 6000)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 6000, 6600)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 6600, 7200)){
                            rankNr = " 1";
                        }
                        rank = "Platinum" + rankNr;
                    }
                    //In range diamond
                    if(inRange(RankedPoints, 7200, 10000) === true){

                        if(inRange(RankedPoints, 7200, 7900)){
                            rankNr = " 4";
                        }
                        if(inRange(RankedPoints, 7900, 8600)){
                            rankNr = " 3";
                        }
                        if(inRange(RankedPoints, 8600, 9300)){
                            rankNr = " 2";
                        }
                        if(inRange(RankedPoints, 9300, 10000)){
                            rankNr = " 1";
                        }
                        rank = "Diamond" + rankNr;
                    }
                    //In range master
                    if(inRange(RankedPoints, 10000, 12000) === true){
                        rank = "Master";
                    }
                    //In range predator need better solution to show top 750
                    if(inRange(RankedPoints, 12000, 40000) === true){
                        rank = "Predator";
                    }
                    //#endregion
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Stats for " + username)
                    .addFields(
                        {
                            name:"__Level__",
                            value: level,
                            inline: true
                        },
                        {
                            name:"__Rank__",
                            value: rank,
                            inline: true
                        }
                    )      
                    .setColor("#e3a600");
                    if(db.has(`${messageAuthor}`) && args[0] == undefined){
                        if(db.has(`${messageAuthor}.rankedPoints`)){
                            var oldRankedPoints = db.get(`${messageAuthor}.rankedPoints`);
                            var rankedPointsDiff = RankedPoints - oldRankedPoints;
                            db.set(`${messageAuthor}.rankedPoints`, RankedPoints);
                            embed.addFields(                        {
                                name:"__RP__",
                                value: RankedPoints + `(${rankedPointsDiff})`,
                                inline: true
                            });
                        }else {db.set(`${messageAuthor}.rankedPoints`, RankedPoints);}
                    }else{embed.addFields(                        {
                        name:"__RP__",
                        value: RankedPoints,
                        inline: true
                    })}

                    message.channel.send({embed});

                }
                catch (e) {
                    message.channel.send("An error accured: " + e)
                }
            });
            }).on('error', function (err) {
            message.channel.send("An error accured: " + err)
        });	
        
    }

    if (command === "top"){
        var sortedData = db.all().sort((a, b) => (a.data.rankedPoints < b.data.rankedPoints) ? 1 : -1)
        const embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setColor("#e3a600");
        for(var i = 0, count = 1; i < sortedData.length; i++){
            embed.addField(
                count + ". " +sortedData[i].data.user,
                sortedData[i].data.rankedPoints + " RP",
                false 
            );
            count++;
        }
        message.channel.send({embed});
    }
});

client.login(config.token);