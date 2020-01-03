//* Libraries
import path from "path";
import winston from "winston";
import morgan from "morgan";
const { format, transports } = winston;

const logger = winston.createLogger({
  format: format.combine(format.timestamp(), format.prettyPrint()),
  transports: []
});

const env = process.env.NODE_ENV;
let morganFormat = "tiny";

if (env === "development") {
  // Log to console
  logger.add(new transports.Console());
} else if (env === "test") {
  // Write to log file
  logger.add(
    new transports.File({
      filename: path.resolve(__dirname, "./../../../logs/server.test.log")
    })
  );
} else if (env === "production") {
  // Save to bucket
  morganFormat = "combined";
}

const httpLogger = morgan(morganFormat, {
  stream: {
    write: (message, encoding) => logger.info(message)
  }
});

export default logger;
export { httpLogger };
