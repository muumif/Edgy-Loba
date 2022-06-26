const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
require("dotenv").config({ path: "../../.env" });
const { logger } = require("./logger");

const { MongoClient } = require("mongodb");
const URI = `mongodb://muumi:${process.env.MONGO_PASSWORD}@192.168.0.13:27017/?authMechanism=DEFAULT`;

const client = new MongoClient(URI);

const commands = [];
const commandFiles = fs.readdirSync("../../commands").filter(file => file.endsWith(".js"));


for (const file of commandFiles) {
	const command = require(`../../commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

async function migrate() {
	try {
		await client.connect();

		const guilds = await client.db("EdgyLoba").collection("guilds").find().toArray();

		for (let i = 0; i < guilds.length; i++) {
			const guildId = guilds[i].guildID;
			const clientId = "719542118955090011";
			(async () => {
				try {
					console.log(i);
					await rest.put(
						Routes.applicationGuildCommands(clientId, guildId),
						{ body: commands },
					);

				}
				catch (error) {
					logger.error(new Error(error), { module: "deploy" });
				}
			})();
		}

	}
	finally {
		await client.close();
	}
}

migrate();