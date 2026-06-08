const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  guildId: String,
  gold: { type: Number, default: 100 },
  xp: { type: Number, default: 0 },
  reputation: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  dailyStreak: { type: Number, default: 0 },
  lastDaily: { type: Date, default: null },
  businesses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Business' }],
  investments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Investment' }],
  achievements: [String],
  workSubmitted: { type: Number, default: 0 },
  workApproved: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.methods.getReputationTier = function() {
  if (this.reputation >= 1000) return { name: 'Prime Tycoon', emoji: '👑', color: '#FFD700' };
  if (this.reputation >= 600) return { name: 'Business Leader', emoji: '🏢', color: '#FF6B6B' };
  if (this.reputation >= 300) return { name: 'Rising Entrepreneur', emoji: '📈', color: '#4ECDC4' };
  if (this.reputation >= 100) return { name: 'Trusted Worker', emoji: '⭐', color: '#95E1D3' };
  return { name: 'Beginner', emoji: '👶', color: '#A8E6CF' };
};

userSchema.methods.addGold = async function(amount, reason) {
  const oldGold = this.gold;
  this.gold += amount;
  this.updatedAt = new Date();
  await this.save();
  
  return {
    oldGold,
    newGold: this.gold,
    amount,
    reason,
    timestamp: new Date(),
  };
};

userSchema.methods.addReputation = async function(amount, reason) {
  const oldReputation = this.reputation;
  this.reputation = Math.max(0, this.reputation + amount);
  this.updatedAt = new Date();
  await this.save();
  
  return {
    oldReputation,
    newReputation: this.reputation,
    amount,
    reason,
    timestamp: new Date(),
  };
};

module.exports = mongoose.model('User', userSchema);
