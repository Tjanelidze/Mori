function shutdown(signal, server, exitcode = 1) {
    console.log(`Received ${signal}, shutting down gracefully.`);
    const forceExit = setTimeout(() => process.exit(exitcode), 10_000).unref();
    server
        ? server.close(() => {
            clearTimeout(forceExit);
            process.exit(exitcode);
        })
        : process.exit(exitcode);
}

module.exports = shutdown;