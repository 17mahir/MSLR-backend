const mongoose = require("mongoose");

const sccSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  used: { type: Boolean, default: false }
});

module.exports = mongoose.model("SCC", sccSchema);
