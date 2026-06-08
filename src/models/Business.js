const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: String,
  name: String,
  profit: { type: Number, default: 0 },
  currentEvent: String,
  eventEndTime: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

businessSchema.methods.applyEvent = async function(eventType, profitModifier) {
  const events = {
    'viral_marketing': { name: 'Viral Marketing Success', profit: 500 },
    'new_customers': { name: 'New Customers', profit: 300 },
    'equipment_failure': { name: 'Equipment Failure', profit: -200 },
    'supply_shortage': { name: 'Supply Shortage', profit: -150 },
    'investor_interest': { name: 'Investor Interest', profit: 1000 },
  };

  const event = events[eventType];
  if (!event) return null;

  this.currentEvent = event.name;
  this.profit += event.profit * (profitModifier || 1);
  this.eventEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
  this.updatedAt = new Date();
  await this.save();

  return event;
};

module.exports = mongoose.model('Business', businessSchema);
