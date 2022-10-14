import { Snowflake } from "discord.js";
import { ObjectId } from "mongodb";

export interface ActiveVotesDocument {
      id?: ObjectId,
      discordId: Snowflake,
      servers: [ string ],
      voteDate: Date,
      endDate: Date | undefined,
      active: boolean,
}

export interface UserDocument {
      id?: ObjectId;
      discordId: Snowflake;
      originId: string;
      RP: number;
      AP: number;
      platform: "PC" | "X1" | "PS4";
      servers: [ string ];
      names: {
            player: string;
            discord: string | undefined;
      }
      updatedAt: Date;
}

export interface ServerDocument {
      id?: ObjectId;
      serverId: Snowflake;
      name: string;
      memberCount: number,
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