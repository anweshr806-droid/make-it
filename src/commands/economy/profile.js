const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('👤 View your profile and stats')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('User to check (default: yourself)')
    ),

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser('user') || interaction.user;
      let user = await User.findOne({ userId: targetUser.id });

      if (!user) {
        return interaction.reply({
          content: `❌ ${targetUser.tag} hasn't started playing yet`,
          ephemeral: true
        });
      }

      const tier = user.getReputationTier();

      const embed = new EmbedBuilder()
        .setColor(tier.color)
        .setTitle(`${tier.emoji} ${targetUser.username}'s Profile`)
        .setThumbnail(targetUser.displayAvatarURL({ size: 512 }))
        .addFields(
          { name: `${tier.emoji} Tier`, value: tier.name, inline: true },
          { name: '⭐ Reputation', value: `${user.reputation}`, inline: true },
          { name: '📊 Level', value: `${user.level}`, inline: true },
          { name: '💰 Gold', value: `${user.gold}`, inline: true },
          { name: '📈 XP', value: `${user.xp}`, inline: true },
          { name: '🔥 Daily Streak', value: `${user.dailyStreak} day${user.dailyStreak !== 1 ? 's' : ''}`, inline: true },
          { name: '👷 Work Submitted', value: `${user.workSubmitted}`, inline: true },
          { name: '✅ Work Approved', value: `${user.workApproved}`, inline: true },
          { name: '🎯 Achievements', value: `${user.achievements.length}`, inline: true },
        )
        .setFooter({ text: `Account created: ${user.createdAt.toLocaleDateString()}` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Profile error:', error);
      return interaction.reply({ 
        content: '❌ An error occurred while fetching the profile', 
        ephemeral: true 
      });
    }
  },
};
