const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../models/GuildConfig');

class NewsSystem {
  constructor(client) {
    this.client = client;
    this.newsArticles = [
      { title: 'Lemon Tea Craze', emoji: '📈', text: 'Lemon Tea demand exploded! Citizens claim it increases business luck by 50%.' },
      { title: 'Invisible Potatoes', emoji: '📉', text: 'Investors accidentally purchased invisible potatoes worth $2M. Market confidence drops.' },
      { title: 'Psychic Cat', emoji: '🐈', text: 'A cat has successfully predicted the market for the third time. Economists baffled.' },
      { title: 'Duck Industry', emoji: '🦆', text: 'Local ducks have cornered 80% of the bread industry. Competition limited.' },
      { title: 'Pizza Millionaire', emoji: '🍕', text: 'A pizza entrepreneur became a millionaire overnight after viral TikTok success.' },
      { title: 'Cheese Futures', emoji: '🧀', text: 'Cheese futures continue rising. Economists remain confused about market logic.' },
      { title: 'Auction News', emoji: '💎', text: 'Rumors suggest an Ancient Crown may appear in the next auction. Bidding will be fierce!' },
      { title: 'Mysterious Carnival', emoji: '🎪', text: 'A mysterious carnival appeared in town. Rare items spotted for sale.' },
      { title: 'AI Exchange', emoji: '🚀', text: 'Cryptocurrency exchange run by sentient AI halts trading. Awaiting CEO explanation.' },
      { title: 'Ancient Book', emoji: '📚', text: 'Library discovers ancient book on wealth creation. Academics confused by its accuracy.' },
      { title: 'Graffiti Stocks', emoji: '🎨', text: 'Street artist\'s graffiti accidentally predicts stock market moves. SEC launches investigation.' },
      { title: 'Tortoise Journey', emoji: '🐢', text: 'Slow-moving tortoise completes epic journey. Traders wait in suspense for impact.' },
      { title: 'Lightning Tweet', emoji: '⚡', text: 'Lightning strike creates market-moving Twitter post. SEC investigating Elon involvement.' },
      { title: 'Banana Crisis Averted', emoji: '🍌', text: 'Banana shortage averted at last second. Traders celebrate with fruit smoothies.' },
      { title: 'Mystery Billionaire', emoji: '🏆', text: 'Unknown billionaire donates entire fortune to random Discord user. Identity remains secret.' },
      { title: 'Gold Rush', emoji: '💰', text: 'New gold deposits discovered! Rare item market expected to boom within hours.' },
      { title: 'Robot Workers', emoji: '🤖', text: 'Automation boom! Robot workers reduce labor costs by 40%. Small businesses unite.' },
      { title: 'Space Mining', emoji: '🪐', text: 'First asteroid mining company launches. Rare earth elements may flood market.' },
      { title: 'AI Startup', emoji: '🧠', text: 'New AI startup raises $500M in Series A. Market sentiment shifts positive.' },
      { title: 'Energy Breakthrough', emoji: '⚡', text: 'Clean energy breakthrough promises cheaper power. Fossil fuel stocks plummet.' },
    ];
  }

  async broadcastNews() {
    try {
      const guilds = this.client.guilds.cache;
      
      for (const guild of guilds.values()) {
        const config = await GuildConfig.findOne({ guildId: guild.id });
        if (!config?.isSetup()) continue;

        const channel = guild.channels.cache.get(config.mainGameChannel);
        if (!channel) continue;

        const randomNews = this.newsArticles[Math.floor(Math.random() * this.newsArticles.length)];

        const embed = new EmbedBuilder()
          .setColor('#FF9500')
          .setTitle(`${randomNews.emoji} World News: ${randomNews.title}`)
          .setDescription(randomNews.text)
          .setFooter({ text: '📰 Breaking News', iconURL: guild.iconURL() })
          .setTimestamp();

        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('News broadcast error:', error);
    }
  }
}

module.exports = NewsSystem;
