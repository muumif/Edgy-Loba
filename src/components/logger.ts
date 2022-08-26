import { Logger, format, createLogger, transports } from "winston";
import { MongoDB, MongoDBConnectionOptions } from "winston-mongodb";

const customFormat = format.printf(({ level, message, timestamp, metadata }) => {
      return `${timestamp} | ${metadata.file} | ${level} | ${message}`;
});

let database = "EdgyLoba";
if (process.env.NODE_ENV == "development") {
      database = "EdgyLobaDEV";
}

const mongoOptions: MongoDBConnectionOptions = {
      db: `mongodb://${process.env.MONGO_CONNECTION}/${database}?authSource=admin`,
      collection: "logs",
      name: "mongodb",
      decolorize: true,
      tryReconnect: true,
      storeHost: true,
      metaKey: "metadata",
};

export const logger: Logger = createLogger({
      level: "info",
      format: format.combine(
            format.timestamp(),
            format.errors({ stack: true }),
            format.splat(),
            format.simple(),
            format.json(),
      ),

      transports: [
            new transports.Console({ // Print logs to the console with a customFormat
                  format: format.combine(
                        format.timestamp({
                              format: "HH:mm:ss",
                        }),
                        format.colorize(),
                        customFormat,
                  ),
            }),
            new transports.File({ filename: "./logs/combined.log" }), // Save logs to a file combined.log
            new MongoDB(mongoOptions),
      ],
});