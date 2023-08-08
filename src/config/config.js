// src/config/config.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database Connected:', connection.connection.host, connection.connection.name);
  } catch (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  }
};

module.exports = connectDb;
