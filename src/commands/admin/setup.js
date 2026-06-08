const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const GuildConfig = require('../../models/GuildConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('🎮 Configure PRIME XP BUSINESS bot channels (Admin only)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(opt =>
      opt.setName('main_game_channel')
        .setDescription('📢 Channel for economy news, auctions, announcements')
        .setRequired(true)
    )
    .addChannelOption(opt =>
      opt.setName('work_review_channel')
        .setDescription('👷 Channel for work submissions and approvals')
        .setRequired(true)
    )
    .addChannelOption(opt =>
      opt.setName('admin_log_channel')
        .setDescription('📋 Channel for logs and moderation actions')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ 
        content: '❌ You must be an Administrator to use this command', 
        ephemeral: true 
      });
    }

    const mainGameChannel = interaction.options.getChannel('main_game_channel');
    const workReviewChannel = interaction.options.getChannel('work_review_channel');
    const adminLogChannel = interaction.options.getChannel('admin_log_channel');

    try {
      let config = await GuildConfig.findOne({ guildId: interaction.guildId });

      if (!config) {
        config = new GuildConfig({
          guildId: interaction.guildId,
        });
      }

      config.mainGameChannel = mainGameChannel.id;
      config.workReviewChannel = workReviewChannel.id;
      config.adminLogChannel = adminLogChannel.id;
      config.setupComplete = true;
      config.updatedAt = new Date();

      await config.save();

      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ PRIME XP BUSINESS - Setup Complete!')
        .setDescription('All channels have been configured successfully! The economy is now active.')
        .setThumbnail('https://cdn-icons-png.flaticon.com/512/3143/3143615.png')
        .addFields(
          { name: '📢 Main Game Channel', value: `<#${mainGameChannel.id}>`, inline: true },
          { name: '👷 Work Review Channel', value: `<#${workReviewChannel.id}>`, inline: true },
          { name: '📋 Admin Log Channel', value: `<#${adminLogChannel.id}>`, inline: true },
          { name: '\n⚙️ Bot Features Active:', value: '✅ Automated Markets\n✅ Daily Rewards\n✅ Work Reviews\n✅ Economy News\n✅ Business Events', inline: false }
        )
        .setFooter({ text: 'PRIME XP BUSINESS v2.0' })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      // Log to admin channel
      const logEmbed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle('⚙️ Bot Setup Completed')
        .setDescription(`Setup configured by ${interaction.user.tag} (${interaction.user.id})`)
        .addFields(
          { name: 'Main Game Channel', value: `<#${mainGameChannel.id}>` },
          { name: 'Work Review Channel', value: `<#${workReviewChannel.id}>` },
          { name: 'Admin Log Channel', value: `<#${adminLogChannel.id}>` }
        )
        .setTimestamp();

      await interaction.client.channels.cache.get(adminLogChannel.id).send({ embeds: [logEmbed] }).catch(console.error);
    } catch (error) {
      console.error('Setup error:', error);
      return interaction.reply({ 
        content: '❌ An error occurred during setup', 
        ephemeral: true 
      });
    }
  },
};
