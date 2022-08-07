/* eslint-disable no-unused-vars */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Message } from "discord.js";

declare module "discord.js" {
    export interface Command {
        name: string,
        description: string,
        execute: (interaction: Interaction) => SomeType // Can be `Promise<SomeType>` if using async
    }
}