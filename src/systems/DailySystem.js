const User = require('../models/User');

class DailySystem {
  constructor(client) {
    this.client = client;
  }

  async resetDaily() {
    try {
      // Reset all daily streaks for inactive users
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const inactiveUsers = await User.find({
        lastDaily: { $lt: yesterday },
        dailyStreak: { $gt: 0 }
      });

      for (const user of inactiveUsers) {
        user.dailyStreak = 0;
        await user.save();
      }

      console.log(`✅ Daily reset: ${inactiveUsers.length} streak(s) reset`);
    } catch (error) {
      console.error('Daily reset error:', error);
    }
  }
}

module.exports = DailySystem;
