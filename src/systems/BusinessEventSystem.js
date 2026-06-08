const Business = require('../models/Business');
const User = require('../models/User');
const GuildConfig = require('../models/GuildConfig');
const { EmbedBuilder } = require('discord.js');

class BusinessEventSystem {
  constructor(client) {
    this.client = client;
    this.events = [
      { type: 'viral_marketing', name: 'Viral Marketing Success', emoji: '📱', gold: 500 },
      { type: 'new_customers', name: 'New Customers Arrived', emoji: '👥', gold: 300 },
      { type: 'equipment_failure', name: 'Equipment Failure', emoji: '🔧', gold: -200 },
      { type: 'supply_shortage', name: 'Supply Shortage', emoji: '📦', gold: -150 },
      { type: 'investor_interest', name: 'Investor Interest', emoji: '💼', gold: 1000 },
    ];
  }

  async triggerBusinessEvents() {
    try {
      const businesses = await Business.find();
      
      for (const business of businesses) {
        const randomEvent = this.events[Math.floor(Math.random() * this.events.length)];
        const user = await User.findOne({ userId: business.userId });
        
        if (!user) continue;

        await business.applyEvent(randomEvent.type);
        await user.addGold(randomEvent.gold, `Business Event: ${randomEvent.name}`);

        // Notify in main channel
        const config = await GuildConfig.findOne({ guildId: business.guildId });
        if (config?.mainGameChannel) {
          const channel = this.client.channels.cache.get(config.mainGameChannel);
          if (channel) {
            const embed = new EmbedBuilder()
              .setColor('#FF9500')
              .setTitle(`${randomEvent.emoji} Business Event`)
              .setDescription(`**${business.name}** (${user.getReputationTier().emoji} <@${user.userId}>)\n\n**Event:** ${randomEvent.name}\n**Impact:** ${randomEvent.gold > 0 ? '+' : ''}${randomEvent.gold} 💰`)
              .setTimestamp();
            
            await channel.send({ embeds: [embed] });
          }
        }
      }
    } catch (error) {
      console.error('Business event system error:', error);
    }
  }
}

module.exports = BusinessEventSystem;
