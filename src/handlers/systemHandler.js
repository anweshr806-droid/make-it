const MarketSystem = require('../systems/MarketSystem');
const NewsSystem = require('../systems/NewsSystem');
const DailySystem = require('../systems/DailySystem');
const BusinessEventSystem = require('../systems/BusinessEventSystem');

module.exports = (client) => {
  // Initialize automated systems
  const marketSystem = new MarketSystem(client);
  const newsSystem = new NewsSystem(client);
  const dailySystem = new DailySystem(client);
  const businessEventSystem = new BusinessEventSystem(client);

  // Start market events every 30-90 minutes
  console.log('📊 Market System started...');
  setInterval(() => marketSystem.triggerRandomEvent(), Math.random() * 60000 + 1800000);

  // Start news announcements every 30-90 minutes
  console.log('📰 News System started...');
  setInterval(() => newsSystem.broadcastNews(), Math.random() * 60000 + 1800000);

  // Start business events every 60-120 minutes
  console.log('🏢 Business Event System started...');
  setInterval(() => businessEventSystem.triggerBusinessEvents(), Math.random() * 60000 + 3600000);

  // Run daily reset at midnight
  const scheduleDaily = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilMidnight = tomorrow - now;
    setTimeout(() => {
      console.log('🔄 Daily reset triggered...');
      dailySystem.resetDaily();
      setInterval(() => dailySystem.resetDaily(), 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
  };

  scheduleDaily();

  console.log('✅ All automated systems initialized');
};
