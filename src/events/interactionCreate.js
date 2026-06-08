const GuildConfig = require('../models/GuildConfig');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({ content: '❌ Command not found', ephemeral: true });
    }

    try {
      // Check if setup is required for gameplay commands
      if (['daily', 'profile', 'work', 'business', 'investments', 'auctions', 'leaderboard'].includes(interaction.commandName)) {
        const config = await GuildConfig.findOne({ guildId: interaction.guildId });
        if (!config?.isSetup()) {
          return interaction.reply({
            content: '❌ **Bot is not set up yet!**\n\n📋 Admin must run `/setup` first to configure:\n• Main Game Channel\n• Work Review Channel\n• Admin Log Channel',
            ephemeral: true
          });
        }
      }

      await command.execute(interaction, client);
    } catch (error) {
      console.error(`❌ Error executing command ${interaction.commandName}:`, error);
      return interaction.reply({ 
        content: '❌ An error occurred while executing this command', 
        ephemeral: true 
      });
    }
  },
};
