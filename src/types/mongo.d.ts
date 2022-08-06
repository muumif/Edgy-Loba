import { Snowflake } from "discord.js";
import { ObjectId } from "mongodb";

export interface UserDocument {
      id?: ObjectId;
      discordId: Snowflake;
      originId: string;
      RP: number;
      AP: number;
      platform: string;
      guilds: [{ id: string; }];
}

export interface GuildDocument {
      id?: ObjectId;
      name: string;
      guildId: Snowflake;
}

export interface HistoryDocument {
      id?: ObjectId;
      discordId: Snowflake;
      date: Date;
      RP: number;
      AP: number;
}

export interface BugDocument {

}