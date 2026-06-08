const mongoose = require('mongoose');

const workSubmissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: String,
  messageId: String,
  description: String,
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  reviewedBy: String,
  reviewedAt: Date,
  goldReward: { type: Number, default: 0 },
  xpReward: { type: Number, default: 0 },
  reputationReward: { type: Number, default: 0 },
  denialReason: String,
});

module.exports = mongoose.model('WorkSubmission', workSubmissionSchema);
