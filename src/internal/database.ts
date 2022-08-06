import { Snowflake } from "discord.js";
import { MongoClient } from "mongodb";
import { HistoryDocument, UserDocument } from "../types/mongo";

const server = `mongodb://${process.env.MONGO_CONNECTION}/?authMechanism=DEFAULT`;

const DBClient = new MongoClient(server);
const usersCollection = DBClient.db("EdgyLoba").collection("users");
const historyCollection = DBClient.db("EdgyLoba").collection("userHistory");

class User {
	discordId: Snowflake;

	constructor(discordId: Snowflake){
		this.discordId = discordId;
	}

	public async getUser() {
		try {
			await DBClient.connect();
	
			const user = await usersCollection.findOne({ discordId: this.discordId.toString()}) as UserDocument | null;
	
			if (user == null) return Promise.reject("User not found!")

			return Promise.resolve(user);
		}
		catch(error){
			return Promise.reject(error);
		}
		finally {	
			await DBClient.close();
		}
	}

	public async getHistory() {
		try {
			await DBClient.connect();
	
			const history = await historyCollection.find({ discordId: this.discordId.toString() }).sort({ date: 1 }).toArray() as HistoryDocument[] | [];
	
			if (history.length == 0) return Promise.reject("No history data was found!")
	
			return Promise.resolve(history);
		}
		catch(error){
			return Promise.reject(error);
		}
		finally {
			await DBClient.close();
		}
	}

	public async addUser(originId: string, RP: number, AP: number, platform: string, guildID: string) {
		try {
			await DBClient.connect();
	
			return await usersCollection.insertOne({
				discordId: this.discordId,
				originId: originId,
				RP: RP,
				AP: AP,
				platform: platform,
				guilds: [guildID],
			})
			.then(function() {return Promise.resolve("User data inserted")})
		}
		catch(error){
			return Promise.reject(error);
		}
		finally {
			await DBClient.close();
		}
	}

	public async addHistory(RP: number, AP: number) {
		try {
			await DBClient.connect();
	
			return await historyCollection.insertOne({
				discordId: this.discordId,
				date: new Date(),
				RP: RP,
				AP: AP,
			})
			.then(function() {return Promise.resolve("History data inserted")})
		}
		catch(error){
			return Promise.reject(error);
		}
		finally {
			await DBClient.close();
		}
	}

	public async updateRP(RP: number) {
		try {
			await DBClient.connect();
	
			return await usersCollection.updateOne({ discordId: this.discordId }, { $set:{ RP: RP } })
			.then(function() {return Promise.resolve("Updated RP")})
		}
		catch(error){
			return Promise.reject(error);
		}
		finally {
			await DBClient.close();
		}
	}

	public async updateAP(AP: number) {
		try {
			await DBClient.connect();
	
			return await usersCollection.updateOne({ discordId: this.discordId }, { $set:{ AP: AP } })
			.then(function() {return Promise.resolve("Updated AP")})
		}
		catch(error){
			return Promise.reject(error);
		}
		finally {
			await DBClient.close();
		}
	}

	public async deleteUser() {
		try {
			await DBClient.connect();
	
			return await usersCollection.deleteOne({ discordId: this.discordId })
			.then(function() {return Promise.resolve("Deleted user")})
		}
		catch(error){
			return Promise.reject(error);
		}
		finally {
			await DBClient.close();
		}
	}
}

class Guild {
	guildId: Snowflake;
	constructor(guildId: Snowflake){
		this.guildId = guildId;
	}
}