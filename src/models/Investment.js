const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: String,
  name: String,
  investedAmount: Number,
  currentValue: Number,
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['active', 'completed', 'failed'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  completesAt: Date,
  updatedAt: { type: Date, default: Date.now },
});

investmentSchema.methods.processReturn = async function() {
  const riskMultipliers = { low: 1.05, medium: 1.15, high: 1.35 };
  const riskPenalties = { low: 0.98, medium: 0.7, high: 0.3 };
  
  const isSuccessful = Math.random() > (this.riskLevel === 'high' ? 0.3 : this.riskLevel === 'medium' ? 0.1 : 0.05);
  
  if (isSuccessful) {
    this.currentValue = this.investedAmount * riskMultipliers[this.riskLevel];
    this.status = 'completed';
  } else {
    this.currentValue = this.investedAmount * riskPenalties[this.riskLevel];
    this.status = 'failed';
  }

  this.updatedAt = new Date();
  await this.save();
  return this;
};

module.exports = mongoose.model('Investment', investmentSchema);
