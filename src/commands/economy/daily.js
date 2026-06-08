const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('🎁 Claim your daily rewards'),

  async execute(interaction) {
    try {
      let user = await User.findOne({ userId: interaction.user.id });

      if (!user) {
        user = new User({ 
          userId: interaction.user.id, 
          guildId: interaction.guildId,
          gold: 100,
        });
      }

      const now = new Date();
      const lastDaily = user.lastDaily;

      // Check if already claimed today
      if (lastDaily && lastDaily.toDateString() === now.toDateString()) {
        const embed = new EmbedBuilder()
          .setColor('#FF6B6B')
          .setTitle('⏱️ Already Claimed')
          .setDescription('You can only claim daily rewards once per day.\n\nCheck back tomorrow!')
          .setThumbnail(interaction.user.displayAvatarURL())
          .setFooter({ text: `Next claim: Tomorrow at 12:00 AM` })
          .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      // Calculate streak
      let streak = user.dailyStreak || 0;
      if (lastDaily) {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDaily.toDateString() === yesterday.toDateString()) {
          streak += 1;
        } else {
          streak = 1;
        }
      } else {
        streak = 1;
      }

      // Calculate reward based on streak
      let baseReward = 50;
      let bonusReward = 0;
      let streakBonus = '';

      if (streak >= 30) {
        bonusReward = 500;
        streakBonus = '🔥🔥🔥 30 Day Streak!';
      } else if (streak >= 7) {
        bonusReward = 100;
        streakBonus = '🔥🔥 7 Day Streak!';
      } else if (streak >= 3) {
        bonusReward = 50;
        streakBonus = '🔥 3 Day Streak!';
      }

      const totalReward = baseReward + bonusReward;

      // Update user
      await user.addGold(totalReward, `Daily reward (Streak: ${streak} days)`);
      user.dailyStreak = streak;
      user.lastDaily = now;
      await user.save();

      const tier = user.getReputationTier();
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Daily Reward Claimed!')
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
          { name: '💰 Base Reward', value: `${baseReward} Gold`, inline: true },
          { name: '🎁 Bonus Reward', value: `${bonusReward} Gold`, inline: true },
          { name: '📊 Total', value: `${totalReward} Gold`, inline: true },
          { name: '🔥 Streak', value: `${streak} day${streak !== 1 ? 's' : ''}${streakBonus ? ' - ' + streakBonus : ''}`, inline: true },
          { name: `${tier.emoji} Tier`, value: tier.name, inline: true },
          { name: '💼 Total Gold', value: `${user.gold}`, inline: true }
        )
        .setFooter({ text: 'Keep the streak going!' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Daily error:', error);
      return interaction.reply({ 
        content: '❌ An error occurred while claiming daily rewards', 
        ephemeral: true 
      });
    }
  },
};
