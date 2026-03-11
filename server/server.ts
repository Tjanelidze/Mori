import app from './app';
import connectToDb from "./db/connection";
import shutdown from "./utils/shutdown";

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToDb();

        const server = app.listen(port, () => {
            console.log(`🚀 Mori Server running on port: ${port}`);
        });

        process.on('unhandledRejection', (reason) => {
            console.error('💥 UNHANDLED REJECTION! Shutting down...');
            console.error(reason);
            if (reason instanceof Error) {
                console.error(reason.stack ?? reason.message);
            } else {
                console.error('Unhandled rejection reason:', String(reason));
            }
            shutdown({signal: 'unhandledRejection', server});
        });
    } catch (err) {
        console.error('❌ Failed to bootstrap server:', err);
        process.exit(1);
    }
}

void startServer();