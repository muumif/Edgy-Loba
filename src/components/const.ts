//Constants that are required in multiple files and when changed need to be same everywhere

import { APIEmbedField, CommandInteraction, GuildEmoji, Snowflake } from "discord.js";

export function profilePic(size: number): string {
      return `https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=${size}`;
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

export const updateQueue: Snowflake[] = [];