import mongoose from "mongoose";

async function connectToDb() {
    const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mori.3rass6o.mongodb.net/TODOS?appName=Mori&retryWrites=true&w=majority`;

    try {
        await mongoose.connect(uri);
    } catch (err: unknown) {

        if (err instanceof Error) {
            console.error('❌ Error connecting to MongoDB:', err.message);
            process.exit(1);
        }

        console.error("An unexpected error occurred", err);
        process.exit(1);
    }
}


export default connectToDb;
