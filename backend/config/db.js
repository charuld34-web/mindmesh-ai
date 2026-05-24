const mongoose = require("mongoose");
require("node:dns/promises").setServers(["1.1.1.1","8.8.8.8"]);
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin12345@cluster0.zcqxafs.mongodb.net/mindmesh?retryWrites=true&w=majority"
    );

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error:", error);
  }
};

module.exports = connectDB;