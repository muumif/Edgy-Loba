//Constants that are required in multiple files and when changed need to be same everywhere

import { APIEmbedField } from "discord.js";

export function profilePic(size: number): string {
      return `https://cdn.discordapp.com/avatars/719542118955090011/82a82af55e896972d1a6875ff129f2f7.png?size=${size}`;
}

export function linksField(name: string, inline: boolean): APIEmbedField {
      return{
            name: name,
            value: "[Invite Me](https://discord.com/api/oauth2/authorize?client_id=719542118955090011&permissions=0&scope=bot%20applications.commands) - [Vote Top.gg](https://top.gg/bot/719542118955090011/vote) - [GitHub](https://github.com/muumif/Edgy-Loba) - [TOS](https://github.com/muumif/Edgy-Loba/blob/master/TOS.md) - [Privacy Policy](https://github.com/muumif/Edgy-Loba/blob/master/PRIVACY.md)",
            inline: inline,
      };
}

export function filename(filename: string) {
      const parts = filename.split(/[\\/]/); 
      return parts[parts.length - 1]
}