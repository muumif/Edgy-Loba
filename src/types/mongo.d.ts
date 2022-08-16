import { Snowflake } from "discord.js";
import { ObjectId } from "mongodb";

interface UserServers {
      serverId: Snowflake;
}

export interface UserDocument {
      id?: ObjectId;
      discordId: Snowflake;
      originId: string;
      RP: number;
      AP: number;
      platform: "PC" | "X1" | "PS4";
      servers: [ UserServers ];
}

export interface ServerDocument {
      id?: ObjectId;
      serverId: Snowflake;
      name: string;
}

export interface HistoryDocument {
      id?: ObjectId;
      discordId: Snowflake;
      date: Date;
      RP: number;
      AP: number;
}

export interface BugDocument {
      id?: ObjectId;
      serverId: Snowflake;
      discordId: Snowflake;
      date: Date;
      bug: {
            command: string;
            message: string
      }
}