import { EmbedBuilder } from "discord.js";
import { profilePic } from "./const";

const defaultTexts = ["Use /bug to report any issues", `Running on version ${process.env.npm_package_version}`, "Thank you for using Edgy Loba", ":)", "Vote for the bot on top.gg", "Report a bug with /bug"];
const errorTexts = ["Error page", "An error accrued", "Report a bug with /bug", "Use /bug to report any issues", "Oh no something went wrong"];

export class embed {
      public defaultEmbed() {
            return new EmbedBuilder()
                  .setTimestamp()
                  .setColor([222, 160, 0]) //Should be in const
                  .setFooter({ text: defaultTexts[Math.floor(Math.random() * defaultTexts.length)], iconURL: profilePic(128) });
      }

      public errorEmbed() {
            return new EmbedBuilder()
                  .setTimestamp()
                  .setColor([220, 55, 45]) // Should be in const
                  .setFooter({ text: errorTexts[Math.floor(Math.random() * errorTexts.length)], iconURL: profilePic(128) });
      }
}
