import { EmbedBuilder, Message } from "discord.js";
import { profilePic } from "./const";
import { DBGlobal } from "./mongo";

const randomFooterDefault = () => {
      const messages = [
            "Use /bug to report issues",
            `Running on version ${process.env.npm_package_version}`,
            "Thank you for using Edgy Loba!",
            ":)",
            "Vote for the bot on top.gg",
            "Report a bug with /bug",
            // `Users in the database ${statistics.userCount}`,
            // `${statistics.serverCount} server are using Edgy Loba!`,
            // `${statistics.historyCount} history data points in the database`,
            // `${statistics.logCount} logs saved this split!`,
      ];

      return messages[Math.floor(Math.random() * messages.length)];
};

const randomFooterError = () => {
      const messages = [
            "Error page",
            "An error accrued",
            "Report a bug with /bug",
            "Use /bug to report any issues",
            "Oh no something went wrong",
      ];

      return messages[Math.floor(Math.random() * messages.length)];
};

export class embed {
      public defaultEmbed() {
            const footerText = randomFooterDefault();
            return new EmbedBuilder()
                  .setTimestamp()
                  .setColor([222, 160, 0]) //Should be in const
                  .setFooter({ text: footerText, iconURL: profilePic(128) });
      }

      public errorEmbed() {
            const footerText = randomFooterError();
            return new EmbedBuilder()
                  .setTimestamp()
                  .setColor([220, 55, 45]) // Should be in const
                  .setFooter({ text: footerText, iconURL: profilePic(128) });
      }
}
