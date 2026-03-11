import app from './app';
import connectToDb from "./db/connection";
import shutdown from "./utils/shutdown";

const port = process.env.PORT || 3000;

connectToDb().then(() => {
    const server = app.listen(port, () => {
        console.log(`🚀 Mori Server running on port: ${port}`);
    });

    // Handle errors that happen outside of Express (e.g. DB connection issues)
    process.on('unhandledRejection', (reason, promise) => {
        console.error('💥 UNHANDLED REJECTION! Shutting down...');
        console.error('At:', promise, 'reason:', reason);
        shutdown({signal: 'unhandledRejection', server});
    });
});