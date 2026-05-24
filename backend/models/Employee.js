const mongoose = require("mongoose");

const employeeSchema =
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true
    },

    productivity: {
      type: Number,
      required: true
    }
  });

module.exports =
  mongoose.model(
    "Employee",
    employeeSchema
  );