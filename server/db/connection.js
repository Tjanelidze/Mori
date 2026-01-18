const mongoose = require('mongoose');

async function connectToDb() {
  const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mori.3rass6o.mongodb.net/TODOS?appName=Mori&retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri);
  } catch (e) {
    console.error('❌ Error connecting to MongoDB:', e.message);
    process.exit(1);
  }
}

function getDB() {
  return connectToDb;
}

module.exports = { getDB, connectToDb };
