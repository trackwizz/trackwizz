import { logger } from './logger';

/**
 * Return a valid port number.
 * @param val
 */
function normalizePort(val: string): number {
    const parsedPort = parseInt(val, 10);
    if (Number.isNaN(parsedPort)) {
        return 8000;
    }

    if (parsedPort >= 0) {
        return parsedPort;
    }

    return 8000;
}

/**
 * Display the error message if the server can't start and stop the program.
 * @param error
 */
function onError(error: Error & { syscall: string, code: string }): void {
    if (error.syscall !== 'listen') {
        throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error('Elevated privileges required.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            logger.error('Port is already in use.');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

export { normalizePort, onError };
