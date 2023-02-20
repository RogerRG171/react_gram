const mongoose = require("mongoose");

//connection
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const url = process.env.BD_URL;

const conn = async () => {
  try {
    mongoose.set("strictQuery", true);
    const db = await mongoose.connect(url, {
      user,
      pass,
    });
    console.log("conectou ao db");
    return db;
  } catch (error) {
    console.log(error);
  }
};

conn();

module.exports = conn;
