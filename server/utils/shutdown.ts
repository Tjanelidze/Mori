interface ShutdownProps {
    signal: string,
    server: any,
    exitCode?: number
}

function shutdown({signal, server, exitCode = 1}: ShutdownProps) {
    console.log(`Received ${signal}, shutting down gracefully.`);
    const forceExit = setTimeout(() => process.exit(exitCode), 10_000).unref();
    server
        ? server.close(() => {
            clearTimeout(forceExit);
            process.exit(exitCode);
        })
        : process.exit(exitCode);
}

export default shutdown;