import winston from "winston";
const { format, transports } = winston;

const logger = winston.createLogger({
  format: format.combine(format.timestamp(), format.prettyPrint()),
  defaultMeta: {
    env: process.env.NODE_ENV
  },
  transports: [new transports.Console()]
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== "production") {
  // TODO: pipe out!
  // logger.add(new transports.Console({
  //   format: format.simple()
  // }));
}

export default logger;
