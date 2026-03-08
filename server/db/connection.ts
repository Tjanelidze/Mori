import mongoose from "mongoose";
import User from "../model/User";
import Todo from "../model/Todos";

async function connectToDb() {
    const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mori.3rass6o.mongodb.net/TODOS?appName=Mori&retryWrites=true&w=majority`;

    try {
        await mongoose.connect(uri);
        await Promise.all([User.init(), Todo.init()]);
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
