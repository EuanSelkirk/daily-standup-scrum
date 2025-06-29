// models/standup.js
const mongoose = require("mongoose");

const standupSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  members: [String],
  responses: {
    type: Map,
    of: String,
    default: () => new Map(),
  },
});

module.exports = mongoose.model("Standup", standupSchema);
