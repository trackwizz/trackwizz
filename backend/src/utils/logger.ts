import { createLogger, format, transports } from "winston";

/**
 * Class to display messages:
 *  - In the console during development process.
 *  - In a log file during production process.
 *
 * Available log levels:
 * - Info
 * - Debug
 * - Warning
 * - Error
 */
const logger = createLogger({
  format: format.combine(format.colorize(), format.simple()),
  level: "debug",
  transports: [new transports.Console()],
});

export { logger };
