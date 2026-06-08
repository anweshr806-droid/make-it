const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

class MarketSystem {
  constructor(client) {
    this.client = client;
    this.events = [
      { name: 'Market Boom', emoji: '📈', color: '#00FF00', description: 'The economy is booming! Investment opportunities surge by 25%.' },
      { name: 'Market Crash', emoji: '📉', color: '#FF0000', description: 'Market panic! Investors withdraw quickly. Prices drop 25%.' },
      { name: 'Coffee Shortage', emoji: '☕', color: '#8B4513', description: 'Global coffee supplies critically low. Coffee futures skyrocket!' },
      { name: 'Lemon Tea Craze', emoji: '🍵', color: '#FFD700', description: 'A viral TikTok trend! Lemon Tea becomes the hottest commodity.' },
      { name: 'Creator Industry Growth', emoji: '👨‍💼', color: '#00BFFF', description: 'Creator economy explodes! Content-based businesses thrive (+30%).' },
      { name: 'Technology Slump', emoji: '💻', color: '#DC143C', description: 'Tech stocks crash after earnings disappointment (-20%).' },
      { name: 'Investment Surge', emoji: '💼', color: '#32CD32', description: 'Venture capitalists throwing money at startups. +40% investment returns!' },
      { name: 'Inflation Alert', emoji: '📊', color: '#FF8C00', description: 'Unexpected inflation detected. Central bank considers action.' },
    ];
  }

  async triggerRandomEvent() {
    try {
      const randomEvent = this.events[Math.floor(Math.random() * this.events.length)];
      await this.broadcastMarketEvent(randomEvent);
    } catch (error) {
      console.error('Market event error:', error);
    }
  }

  async broadcastMarketEvent(event) {
    try {
      const guilds = this.client.guilds.cache;
      
      for (const guild of guilds.values()) {
        const config = await GuildConfig.findOne({ guildId: guild.id });
        if (!config?.isSetup()) continue;

        const channel = guild.channels.cache.get(config.mainGameChannel);
        if (!channel) continue;

        const embed = new EmbedBuilder()
          .setColor(event.color)
          .setTitle(`${event.emoji} Market Event: ${event.name}`)
          .setDescription(event.description)
          .setFooter({ text: 'Economy adjusting...', iconURL: guild.iconURL() })
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Broadcast market event error:', error);
    }
  }
}

module.exports = MarketSystem;
