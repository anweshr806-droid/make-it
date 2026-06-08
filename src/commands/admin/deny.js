const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const WorkSubmission = require('../../models/WorkSubmission');
const GuildConfig = require('../../models/GuildConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deny')
    .setDescription('❌ Deny a work submission (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt =>
      opt.setName('submission_id')
        .setDescription('ID of the work submission to deny')
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName('reason')
        .setDescription('Reason for denial')
        .setMaxLength(200)
    ),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ 
        content: '❌ You must be an Administrator to use this command', 
        ephemeral: true 
      });
    }

    const submissionId = interaction.options.getString('submission_id');
    const reason = interaction.options.getString('reason') || 'No reason provided';

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

      // Update submission
      submission.status = 'denied';
      submission.reviewedBy = interaction.user.id;
      submission.reviewedAt = new Date();
      submission.denialReason = reason;
      await submission.save();

      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setTitle('❌ Work Submission Denied')
        .setThumbnail('https://cdn-icons-png.flaticon.com/512/1828/1828665.png')
        .addFields(
          { name: '👤 Worker', value: `<@${submission.userId}>`, inline: true },
          { name: '✍️ Reviewer', value: `${interaction.user.tag}`, inline: true },
          { name: 'Reason', value: reason, inline: false }
        )
        .setFooter({ text: 'Work denied by admin' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      // Log to admin channel
      const config = await GuildConfig.findOne({ guildId: interaction.guildId });
      if (config?.adminLogChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ Work Denied')
          .setDescription(`${interaction.user.tag} denied work for <@${submission.userId}>`)
          .addFields(
            { name: 'Reason', value: reason }
          )
          .setTimestamp();

        await interaction.client.channels.cache.get(config.adminLogChannel).send({ embeds: [logEmbed] }).catch(console.error);
      }
    } catch (error) {
      console.error('Deny error:', error);
      return interaction.reply({ 
        content: '❌ An error occurred while denying the submission', 
        ephemeral: true 
      });
    }
  },
};
