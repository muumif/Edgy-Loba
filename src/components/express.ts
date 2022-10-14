import express, { Express, Request, Response } from "express";
import { logger } from "./logger";
import { filename } from "./const";
import { DBGlobal, DBServer, DBUser } from "./mongo";
import { ActiveVotesDocument } from "../types/mongo";
import { client } from "../index";
import { updateMemberCount, updateUserNames } from "./tools";
import schedule from "node-schedule";


const webServer: Express = express();
const port = process.env.WEBSERVER_PORT;

webServer.use(express.json());

webServer.get("/", (req: Request, res: Response) => {
      res.send("Server is online!");
});

webServer.post("/hooks/topgg", async (req: Request, res: Response) => {
      if (req.headers.authorization == process.env.WEBHOOK_PASSWORD) {
            logger.info(`Got post request from ${req.ip} to /hooks/topgg`, { metadata: { file: filename(__filename) } });
            const voteDate = new Date();
            const endDate = new Date();
            endDate.setDate(voteDate.getDate() + 1);
            const discordUser = (await client.users.fetch(req.body.user.toString()));
            const servers = await new DBUser(discordUser).getServers() as [string];
            const voteDocument: ActiveVotesDocument = {
                  discordId: req.body.user,
                  servers: servers,
                  voteDate: voteDate,
                  endDate: endDate,
                  active: true,
            };
            await new DBGlobal().addVote(voteDocument);
            schedule.scheduleJob(endDate, async function() {
                  await new DBGlobal().removeVote(req.body.user);
            });
            res.sendStatus(200);
      }
      else {
            logger.error(`Unauthorized access from: ${req.ip}`, { metadata: { file: filename(__filename) } });
            res.sendStatus(401);
      }
});

webServer.get("/tools/update/members", async (req: Request, res: Response) => {
      if (req.headers.authorization != process.env.WEBHOOK_PASSWORD) {
            logger.error(`Unauthorized access from: ${req.ip}`, { metadata: { file: filename(__filename) } });
            res.sendStatus(401);
            return;
      }

      logger.info(`Got post request from ${req.ip} to /tools/update/members`, { metadata: { file: filename(__filename) } });
      await updateMemberCount().then(servers => {
            res.status(200).send(servers);
      }).catch(error => {
            res.status(500).send(error);
      });
});

webServer.get("/tools/update/names", async (req: Request, res: Response) => {
      if (req.headers.authorization != process.env.WEBHOOK_PASSWORD) {
            logger.error(`Unauthorized access from: ${req.ip}`, { metadata: { file: filename(__filename) } });
            res.sendStatus(401);
            return;
      }

      logger.info(`Got post request from ${req.ip} to /tools/update/names`, { metadata: { file: filename(__filename) } });
      await updateUserNames().then(users => {
            res.status(200).send(users);
      }).catch(error => {
            res.status(500).send(error);
      });
});

webServer.listen(port, () => {
      logger.info(`Web Server is online on port: ${port}`, { metadata: { file: filename(__filename) } });
});
