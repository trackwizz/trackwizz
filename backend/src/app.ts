import { config } from "dotenv";
import { Connection } from "typeorm";
import logo from "asciiart-logo";
import { logger } from "./utils/logger";
import { normalizePort, onError } from "./utils/server-utils";
config(); // Get environment variables
import server from "./app/server";
import { connectToDatabase } from "./utils/database";

/**
 * Main function, start of the program.
 */
async function main(): Promise<void> {
  const connection: Connection | null = await connectToDatabase();
  if (connection === null) {
    throw new Error("Could not connect to database...");
  }
  logger.info(`Database connection established: ${connection.isConnected}`);

  /* --- Start server --- */
  const port = normalizePort(process.env.PORT || "5000");
  const app = server.listen(port);
  app.on("error", onError);
  app.on("listening", () => {
    logger.info(`App listening on port ${port}!`);
  });
}

// Display trackwizz logo
console.log(
  logo({
    name: "T R A C K W I Z Z",
    font: "Dancing Font",
    lineChars: 17,
    padding: 2,
    margin: 3,
    borderColor: "blue",
    logoColor: "bold-green",
    textColor: "yellow",
  })
    .emptyLine()
    .emptyLine()
    .right("version 2.0.1")
    .render(),
);

// Start program with error handler.
main().catch((err: Error) => {
  logger.error(err.message);
});
