const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  mainGameChannel: String,
  workReviewChannel: String,
  adminLogChannel: String,
  setupComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

guildConfigSchema.methods.isSetup = function() {
  return this.mainGameChannel && this.workReviewChannel && this.adminLogChannel && this.setupComplete;
};

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
