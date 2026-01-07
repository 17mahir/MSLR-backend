const mongoose = require("mongoose");

const referendumSchema = new mongoose.Schema({
  title: String,
  description: String,
  options: [
    {
      optionText: String,
      votes: { type: Number, default: 0 }
    }
  ],
  status: { type: String, default: "closed" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Referendum", referendumSchema);
