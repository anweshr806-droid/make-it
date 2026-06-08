const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const WorkSubmission = require('../../models/WorkSubmission');
const User = require('../../models/User');
const GuildConfig = require('../../models/GuildConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('👷 Submit work for admin approval')
    .addSubcommand(sub =>
      sub.setName('submit')
        .setDescription('Submit work for review')
        .addStringOption(opt =>
          opt.setName('description')
            .setDescription('Describe the work you completed')
            .setMaxLength(1000)
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'submit') {
      try {
        const description = interaction.options.getString('description');
        const config = await GuildConfig.findOne({ guildId: interaction.guildId });

        if (!config?.isSetup()) {
          return interaction.reply({
            content: '❌ Bot is not set up yet. Admin must run /setup first.',
            ephemeral: true
          });
        }

        // Create or update user
        let user = await User.findOne({ userId: interaction.user.id });
        if (!user) {
          user = new User({ userId: interaction.user.id, guildId: interaction.guildId });
        }
        user.workSubmitted += 1;
        await user.save();

        // Create work submission
        const submission = new WorkSubmission({
          userId: interaction.user.id,
          guildId: interaction.guildId,
          description,
          status: 'pending',
        });

        await submission.save();

        // Send to work review channel
        const reviewChannel = interaction.client.channels.cache.get(config.workReviewChannel);
        if (reviewChannel) {
          const reviewEmbed = new EmbedBuilder()
            .setColor('#FFA500')
            .setTitle('📋 New Work Submission')
            .addFields(
              { name: '👤 Worker', value: `<@${interaction.user.id}> (${interaction.user.tag})`, inline: true },
              { name: '📝 Submission ID', value: `\`${submission._id.toString().slice(0, 12)}\``, inline: true },
              { name: 'Description', value: description, inline: false },
              { name: 'Submitted', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            )
            .setThumbnail(interaction.user.displayAvatarURL())
            .setFooter({ text: 'Use /approve or /deny to handle this submission' })
            .setTimestamp();

          const message = await reviewChannel.send({ embeds: [reviewEmbed] });
          submission.messageId = message.id;
          await submission.save();
        }

        const confirmEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('✅ Work Submitted Successfully')
          .setDescription('Your work has been submitted for admin review.')
          .setThumbnail('https://cdn-icons-png.flaticon.com/512/1048/1048954.png')
          .addFields(
            { name: '📝 Submission ID', value: `\`${submission._id.toString().slice(0, 12)}\``, inline: false },
            { name: '⏳ Status', value: 'Pending Admin Review', inline: false },
            { name: '💡 Tip', value: 'Admins will review your work and provide rewards if approved!' }
          )
          .setFooter({ text: 'PRIME XP BUSINESS' })
          .setTimestamp();

        await interaction.reply({ embeds: [confirmEmbed] });
      } catch (error) {
        console.error('Work submit error:', error);
        return interaction.reply({ 
          content: '❌ An error occurred while submitting work', 
          ephemeral: true 
        });
      }
    }
  },
};
