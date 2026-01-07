const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  fullName: String,
  dob: Date,
  password: String,
  scc: { type: String, unique: true },
  role: { type: String, default: "voter" },
  votedReferendums: [{ type: mongoose.Schema.Types.ObjectId, ref: "Referendum" }]
});

module.exports = mongoose.model("User", userSchema);
