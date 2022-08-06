import  { Logger, format, createLogger, transports } from  'winston';

const customFormat = format.printf(({ level, message, timestamp, file }) => {
      return `${timestamp} | ${file} | ${level} | ${message}`;
});

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
	],
})