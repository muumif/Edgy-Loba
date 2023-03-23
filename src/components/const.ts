//Constants that are required in multiple files and when changed need to be same everywhere

import { ActionRowBuilder, ActivityType, APIEmbedField, ButtonBuilder, ButtonStyle, CommandInteraction, GuildEmoji } from "discord.js";
import { readdirSync } from "fs";
import { cwd } from "process";

export function profilePic(size: number): string {
      return `https://cdn.discordapp.com/avatars/719542118955090011/812d9cde81554928e2cd7bd92d032060.webp?size=${size}`;
}

export function linksField(name: string, inline: boolean): APIEmbedField {
      return {
            name: name,
            value: "[Invite Me](https://bit.ly/3wo2Tkh) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [GitHub](https://github.com/muumif/Edgy-Loba) - [TOS](https://github.com/muumif/Edgy-Loba/blob/master/TOS.md) - [Privacy Policy](https://github.com/muumif/Edgy-Loba/blob/master/PRIVACY.md)",
            inline: inline,
      };
}

export function filename(filename: string) {
      const parts = filename.split(/[\\/]/);
      return parts[parts.length - 1];
}

export const chartBackgroundColor = "#36393f";

export function emojis(interaction: CommandInteraction) {
      const PCEmoji = interaction.client.emojis.cache.get("987422520363868251") as GuildEmoji;
      const PSEmoji = interaction.client.emojis.cache.get("987422521680855100") as GuildEmoji;
      const XboxEmoji = interaction.client.emojis.cache.get("987422524654641252") as GuildEmoji;
      const OnlineEmoji = interaction.client.emojis.cache.get("987434490525794435") as GuildEmoji;
      const IdleEmoji = interaction.client.emojis.cache.get("987439560856334356") as GuildEmoji;
      const OfflineEmoji = interaction.client.emojis.cache.get("987434491951841371") as GuildEmoji;

      return [PCEmoji, PSEmoji, XboxEmoji, OnlineEmoji, IdleEmoji, OfflineEmoji] as GuildEmoji[];
}

export const ansiColors = {
      Gray: "\u001b[0;30m",
      Red: "\u001b[0;31m",
      Green: "\u001b[0;32m",
      Yellow: "\u001b[0;33m",
      Blue: "\u001b[0;34m",
      Pink: "\u001b[0;35m",
      Cyan: "\u001b[0;36m",
      White: "\u001b[0;37m",
};

export const presences = (statistics: {userCount: number, serverCount: number, historyCount: number, logCount: number}) => {
      const activities = [
            { type: 3, name: `${statistics.serverCount} servers!` },
            { type: 2, name: "/help" },
            { type: 2, name: "/about" },
            { type: 0, name: `version ${process.env.npm_package_version}` },
            { type: 2, name: `${statistics.userCount} users!` },
      ];

      return activities[Math.floor(Math.random() * activities.length)];
};

export const linksButtons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
            new ButtonBuilder()
                  .setLabel("Invite me")
                  .setURL("https://bit.ly/3wo2Tkh")
                  .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                  .setLabel("Vote")
                  .setURL("https://top.gg/bot/719542118955090011/vote")
                  .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                  .setLabel("GitHub")
                  .setURL("https://github.com/muumif/")
                  .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                  .setLabel("Terms Of Service")
                  .setURL("https://github.com/muumif/Edgy-Loba/blob/master/TOS.md")
                  .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                  .setLabel("Privacy Policy")
                  .setURL("https://github.com/muumif/Edgy-Loba/blob/master/PRIVACY.md")
                  .setStyle(ButtonStyle.Link),
      );

export function getCommands(cmdFolder:string) {
      const commands = [];

      const files = readdirSync(`${cwd()}/prod/commands/${cmdFolder}`).filter(file => file.endsWith(".js"));
      for (const file of files) {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const command = require(`${cwd()}/prod/commands/${cmdFolder}/${file}`);
            commands.push(command.data.toJSON());
      }
      const fields: APIEmbedField[] = [];

      commands.map((ob) => fields.push({
            name : `${"```"}${ob.name}${"```"}`,
            value : ob.description,
            inline: false,
      }));

      return fields;
}