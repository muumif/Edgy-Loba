const Discord = require('discord.js');
const config = require('./config.json');
const axios = require('axios');
const firebase = require("firebase/app");
const { set, getDatabase, ref, get, child } = require('firebase/database');

const client = new Discord.Client();
const prefix = config.prefix;

const firebaseConfig = {
    apiKey: config.firebase_apiKey,
    authDomain: "edgyloba.firebaseapp.com",
    databaseURL: "https://edgyloba-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "edgyloba",
    storageBucket: "edgyloba.appspot.com",
    messagingSenderId: config.firebase_messagingSenderId,
    appId: config.firebase_appId
}

const app = firebase.initializeApp(firebaseConfig);

function writeUserData(guildID, userID, name, currentRP, rankIMG, platform, level){
    const database = getDatabase(app);
    set(ref(database, "guilds/" + guildID + "/users/" + userID), {
        username: name,
        platform: platform,
        level: level,
        RP: currentRP,
        img: rankIMG
    });
};

function writeHistoryData(rp, userID, guildID){
    let today = new Date();
    let monthVal = today.getUTCMonth() + 1;   
    let date = today.getUTCDate() + "-" + monthVal + "-" + today.getUTCFullYear();

    const database = getDatabase(app);
    set(child(ref(database), "guilds/" + guildID + "/history/" +  userID + "/" + date), {
        date: date,
        rp: rp
    });
};

async function getHistoryData(guildID, userID, _callback){
    const dbRef = ref(getDatabase(app));
    let labels = [], dataArray = []; 

    await get(child(dbRef, "guilds/" + guildID + "/history/" + userID))
    .then((snapshot) => {
        if(snapshot.exists){
            snapshot.forEach(function (data) {
                labels.push(data.val().date);
                dataArray.push(data.val().rp);
            });
        }
    }).catch((error) => {
        console.log(error);
    });
    

    let arrayPairs = labels.map(function(a,b) {return [a, dataArray[b]]});
    for (let i = 0; i < arrayPairs.length; i++) {
        arrayPairs[i][0] = arrayPairs[i][0].split("-").reverse().join("/");     
    }
    
    arrayPairs.sort(function (a,b) {
        var dateA = new Date(a[0]), dateB = new Date(b[0]);
        return dateA - dateB;
    });

    let finalLabels = [], finalDataArray = [];
    for (let i = 0; i < arrayPairs.length; i++) {
        finalLabels.push(arrayPairs[i][0]);
        finalDataArray.push(arrayPairs[i][1]);
    };
    
    _callback(finalLabels, finalDataArray);
};

async function fetchUser(id, callback){
    let user = await client.users.fetch(id);
    callback(user);
};

function makeChart(_labels = [],_data = []){
    const chart = `https://image-charts.com/chart.js/2.8.0?bkg=rgb(54,57,63)&c={type:'line',data:{labels:[${_labels.map(function(ele){return "'" + ele + "'"})}],datasets:[{backgroundColor:'rgba(44,47,51,0)',borderColor:'rgb(277,166,0)',data:[${_data}],label:'RP'}]},options:{scales:{yAxes:[{ticks:{stepSize: 200}}]}}}`;
    return encodeURI(chart);
};

client.once("ready", () => {
    console.log("Edgy Loba is now online!");
    client.user.setPresence({ activity: { name: ">help", type: "LISTENING" }, status: "online" });
});

client.on("message", async message => {

    if (message.author.bot) return;
    if (message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === "help"){
        
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

        message.channel.send({embed});
    }

    if (command === "link"){ // Find a way to confirm that it is their account
        const dbRef = ref(getDatabase(app));

        await get(child(dbRef, "guilds/" + message.guild.id + "/users/" + message.author.id))
        .then((snapshot) => {
            if(snapshot.exists()){
                const embed = new Discord.MessageEmbed()
                .setTitle("Username already linked!")
                .setDescription("Do unlink your account use **!unlink**")
                .setColor("#e3a600")
                return message.channel.send({embed}); 
            }else{
                if(args[0] == undefined){
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Wrong format!")
                    .setDescription("Correct way: **!link (Apex username) (PC/PS4/X1)**")
                    .setColor("#e3a600");
                    return message.channel.send({embed});
                }
                if(args[1] == undefined){
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Wrong format!")
                    .setDescription(`Correct way: **!link ${args[0]} (PC/PS4/X1)**`)
                    .setColor("#e3a600");
                    return message.channel.send({embed});
                }
                var username = args[0];
                var platform = args[1].toUpperCase();
                setTimeout(async () => {
                    const URI = `https://api.mozambiquehe.re/bridge?version=5&platform=${platform}&player=${username}&auth=${config.ALS_Token}`;
                    const encodedURI = encodeURI(URI);
                    await axios.get(encodedURI)
                    .then(function (response){
                    writeUserData(message.guild.id, message.author.id, response.data.global.name, response.data.global.rank.rankScore, response.data.global.rank.rankImg, platform, response.data.global.level);
                    writeHistoryData(response.data.global.rank.rankScore, message.author.id, message.guild.id);
                    const embed = new Discord.MessageEmbed()
                    .setTitle("Username successfully linked!")
                    .setDescription(`${message.author} linked to **${username} using ${platform}**`)
                    .setColor("#e3a600");
                      message.channel.send({embed});
                      message.channel.stopTyping();
                    })
          
                    .catch(function(error){
                        if(error.response){
                            message.channel.send(
                                new Discord.MessageEmbed()
                                .setTitle("Error")
                                .setDescription(error.response.data.Error)
                                .setColor("#e3a600")
                            );
                            message.channel.stopTyping();
                        }
                    });
                  }, 250);
            }
        }).catch((error) => {
            message.channel.send(error);
        })    
    }

    if (command === "unlink"){
        const dbRef = ref(getDatabase(app));

        await get(child(dbRef, "guilds/" + message.guild.id + "/users/" + message.author.id))
        .then((snapshot) => {
            if(snapshot.exists()){
                set(ref(getDatabase(app), "guilds/" + message.guild.id + "/users/" + message.author.id), null);
                const embed = new Discord.MessageEmbed()
                .setTitle("Username has been unlinked!")
                .setColor("#e3a600");
                return message.channel.send({embed});
            }else{
                const embed = new Discord.MessageEmbed()
                .setTitle("You don't have any linked usernames!")
                .setDescription("You can link your username: **!link (Apex username) (PC/PS4/X1)**")
                .setColor("#e3a600");
                return message.channel.send({embed})
            }
        }).catch((error) => {
            message.channel.send(
                new Discord.MessageEmbed()
                .setTitle("Error")
                .setDescription(error.response.data.Error)
                .setColor("#e3a600")
            );
            message.channel.stopTyping();
        });

    }

    if (command === "stats"){
        var IGN;
        var platform;
        const dbRef = ref(getDatabase(app));

        if (args[0] == undefined){
            await get(child(dbRef, "guilds/" + message.guild.id + "/users/" + message.author.id))
            .then((snapshot) => {
                if(!snapshot.exists()){
                    const embed1 = new Discord.MessageEmbed()
                    .setTitle("No username has been linked!")
                    .setDescription("You can link your username: **!link (Apex username) (PC/PS4/X1)**")
                    .setColor("#e3a600");
                    return message.channel.send({embed1});
                }else{
                    var data = snapshot.val();
                    IGN = data.username;
                }
            }).catch((error) => {
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setTitle("Error")
                    .setDescription(error)
                    .setColor("#e3a600")
                );
                message.channel.stopTyping();
            })
        }else(IGN = args[0])

        if (args[1] == undefined){
            await get(child(dbRef, "guilds/" + message.guild.id + "/users/" + message.author.id))
            .then((snapshot) => {
                if(!snapshot.exists()){
                    const embed2 = new Discord.MessageEmbed()
                    .setTitle("No username has been linked")
                    .setDescription(`You can link your username: **!link ${args[0]} (PC/PS4/X1)**`)
                    .setColor("#e3a600");
                    message.channel.send({embed2}); 
                }else{
                    var data = snapshot.val();
                    platform = data.platform;
                }
            }).catch((error) => {
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setTitle("Error")
                    .setDescription(error.response.data.Error)
                    .setColor("#e3a600")
                );
                message.channel.stopTyping();
            });
        }else{platform = args[1]};

        message.channel.startTyping();

        setTimeout(async () => {
          const URI = `https://api.mozambiquehe.re/bridge?version=5&platform=${platform.toUpperCase()}&player=${IGN}&auth=${config.ALS_Token}`;
          const encodedURI = encodeURI(URI);          
          await axios.get(encodedURI)
          .then(function (response){
            const embed = new Discord.MessageEmbed()
            .setTitle("Stats for " + response.data.global.name)
            .setAuthor("Platform: " + platform.toUpperCase())
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
            if(args[0] == undefined){
                get(child(dbRef, "guilds/" + message.guild.id + "/users/" + message.author.id ))
                .then((snapshot) => {
                    if(snapshot.exists()){
                        writeUserData(message.guild.id, message.author.id, response.data.global.name, response.data.global.rank.rankScore, response.data.global.rank.rankImg, platform, response.data.global.level);
                        writeHistoryData(response.data.global.rank.rankScore, message.author.id, message.guild.id);
                        getHistoryData(message.guild.id, message.author.id, function(_labels, _data){
                            embed.setImage(makeChart(_labels,_data));
                            embed.setDescription("Account linked to " + message.author.tag);
                            message.channel.send({embed});
                        });
                    };
                }).catch((error) => {
                    message.channel.send(
                        new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription(error)
                        .setColor("#e3a600")
                    );
                    message.channel.stopTyping();
                });
            }else{
                get(child(dbRef, "guilds/" + message.guild.id + "/users/"))
                .then((snapshot) => {
                    if(snapshot.exists()){
                        snapshot.forEach(function (user) {
                            if (user.val().username == response.data.global.name){
                                writeHistoryData(response.data.global.rank.rankScore, user.key, message.guild.id);
                                getHistoryData(message.guild.id, user.key, function(_labels, _data){
                                    embed.setImage(makeChart(_labels, _data));
                                    fetchUser(user.key, function(a){
                                        embed.setDescription("Account linked to " + a.username + "#" + a.discriminator);
                                        message.channel.send({embed});
                                    });
                                });
                            };
                        });
                    };
                }).catch((error) => {
                    message.channel.send(
                        new Discord.MessageEmbed()
                        .setTitle("Error")
                        .setDescription(error)
                        .setColor("#e3a600")
                    );
                });
            };

            message.channel.stopTyping();
                
            }).catch((error) => {
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setTitle("Error")
                    .setDescription(error)
                    .setColor("#e3a600")
                );
                message.channel.stopTyping();
            });
        }, 250);
    }

    if(command === "top"){ //Todo chart with all values
        const dbRef = ref(getDatabase(app));

        const embed = new Discord.MessageEmbed()
        .setTitle("Leaderboard")
        .setColor("#e3a600");

        var sortedArray = [];

        message.channel.startTyping();

        await get(child(dbRef, "guilds/" + message.guild.id + "/users"))
        .then((snapshot) => {
            if(snapshot.exists()){
                snapshot.forEach(function(_child){
                    sortedArray.push(_child.val());
                });
                sortedArray.sort((a,b) => {return b.RP - a.RP;})
                message.channel.stopTyping();
            }
        }).catch((error) => {
            message.channel.send(error);
            message.channel.stopTyping();
        });

        for(i = 0, count = 1; i < sortedArray.length; i++){
            embed.addField(count + ". " + sortedArray[i].username, "RP: " + sortedArray[i].RP, false);
            count++;
        }

        message.channel.send({embed});
        message.channel.stopTyping();
    }

    if (command === "map"){
        setTimeout(async () => {
            message.channel.startTyping();
            const URI = `https://api.mozambiquehe.re/maprotation?version=2&auth=${config.ALS_Token}`;
            const encodedURI = encodeURI(URI);          
            await axios.get(encodedURI)
            .then(function (response){
                const embed = new Discord.MessageEmbed()
                .setTitle("Map Rotation")
                .addFields(
                    {
                        name: "__Battle Royale__",
                        value: `Current map: **${response.data.battle_royale.current.map}**\nNext Map: **${response.data.battle_royale.next.map}**\nRemaining: **${response.data.battle_royale.current.remainingMins} min**`,
                        inline: true
                    },
                    {
                        name: "__Arenas__",
                        value: `Current map: **${response.data.arenas.current.map}**\nNext Map: **${response.data.arenas.next.map}**\nRemaining: **${response.data.arenas.current.remainingMins} min**`,
                        inline: true
                    },
                    {
                        name: "__Arenas Ranked__",
                        value: `Current map: **${response.data.arenasRanked.current.map}**\nNext Map: **${response.data.arenasRanked.next.map}**\nRemaining: **${response.data.arenasRanked.current.remainingMins} min**`,
                        inline: true
                    }
                )
                .setImage(response.data.battle_royale.current.asset)
                .setColor("#e3a600");
                message.channel.stopTyping();
                message.channel.send({embed});
            }).catch((error) => {
                console.log(error);
                message.channel.stopTyping();
            });
        }, 255);
    }

    if (command === "status"){
        //todo
    }
});

client.login(config.token);
