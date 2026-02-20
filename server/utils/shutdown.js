function shutdown(signal, server) {
    console.log(`Received ${signal}, shutting down gracefully.`);
    const forceExit = setTimeout(() => process.exit(1), 10_000).unref();
    server
        ? server.close(() => {
            clearTimeout(forceExit);
            process.exit(0);
        })
        : process.exit(0);
}

module.exports = shutdown;