const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const WorkSubmission = require('../../models/WorkSubmission');
const User = require('../../models/User');
const GuildConfig = require('../../models/GuildConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('approve')
    .setDescription('✅ Approve a work submission (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt =>
      opt.setName('submission_id')
        .setDescription('ID of the work submission to approve')
        .setRequired(true)
    )
    .addNumberOption(opt =>
      opt.setName('gold_reward')
        .setDescription('Amount of gold to reward (default: 100)')
        .setMinValue(1)
        .setMaxValue(5000)
    )
    .addNumberOption(opt =>
      opt.setName('xp_reward')
        .setDescription('Amount of XP to reward (default: 50)')
        .setMinValue(1)
        .setMaxValue(5000)
    )
    .addNumberOption(opt =>
      opt.setName('reputation_reward')
        .setDescription('Amount of reputation to reward (default: 25)')
        .setMinValue(1)
        .setMaxValue(500)
    ),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ 
        content: '❌ You must be an Administrator to use this command', 
        ephemeral: true 
      });
    }

    const submissionId = interaction.options.getString('submission_id');
    const goldReward = interaction.options.getNumber('gold_reward') || 100;
    const xpReward = interaction.options.getNumber('xp_reward') || 50;
    const reputationReward = interaction.options.getNumber('reputation_reward') || 25;

    try {
      const submission = await WorkSubmission.findById(submissionId);

      if (!submission) {
        return interaction.reply({ 
          content: '❌ Work submission not found', 
          ephemeral: true 
        });
      }

      if (submission.status !== 'pending') {
        return interaction.reply({ 
          content: `❌ This submission has already been ${submission.status}`, 
          ephemeral: true 
        });
      }

      // Update or create user
      let user = await User.findOne({ userId: submission.userId });
      if (!user) {
        user = new User({ userId: submission.userId, guildId: interaction.guildId });
      }

      await user.addGold(goldReward, 'Work submission approved');
      user.xp += xpReward;
      user.workApproved += 1;
      await user.addReputation(reputationReward, 'Work submission approved');

      // Update submission
      submission.status = 'approved';
      submission.reviewedBy = interaction.user.id;
      submission.reviewedAt = new Date();
      submission.goldReward = goldReward;
      submission.xpReward = xpReward;
      submission.reputationReward = reputationReward;
      await submission.save();

      const tier = user.getReputationTier();
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Work Submission Approved!')
        .setThumbnail('https://cdn-icons-png.flaticon.com/512/1048/1048954.png')
        .addFields(
          { name: '👤 Worker', value: `<@${submission.userId}>`, inline: true },
          { name: '💰 Gold', value: `+${goldReward}`, inline: true },
          { name: '⭐ Reputation', value: `+${reputationReward}`, inline: true },
          { name: '📊 XP', value: `+${xpReward}`, inline: true },
          { name: 'Current Tier', value: `${tier.emoji} ${tier.name}`, inline: true },
          { name: '✍️ Reviewer', value: `${interaction.user.tag}`, inline: true }
        )
        .setFooter({ text: 'Work approved by admin' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      // Log to admin channel
      const config = await GuildConfig.findOne({ guildId: interaction.guildId });
      if (config?.adminLogChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#00AA00')
          .setTitle('✅ Work Approved')
          .setDescription(`${interaction.user.tag} approved work for <@${submission.userId}>`)
          .addFields(
            { name: '💰 Gold', value: `+${goldReward}` },
            { name: '📊 XP', value: `+${xpReward}` },
            { name: '⭐ Reputation', value: `+${reputationReward}` }
          )
          .setTimestamp();

        await interaction.client.channels.cache.get(config.adminLogChannel).send({ embeds: [logEmbed] }).catch(console.error);
      }
    } catch (error) {
      console.error('Approve error:', error);
      return interaction.reply({ 
        content: '❌ An error occurred while approving the submission', 
        ephemeral: true 
      });
    }
  },
};
