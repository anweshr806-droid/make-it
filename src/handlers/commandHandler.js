const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

module.exports = (client) => {
  const commandsPath = path.join(__dirname, '../commands');
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(path.join(folderPath, file));
      if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
      }
    }
  }

  // Register commands with Discord
  const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  (async () => {
    try {
      console.log(`🔄 Refreshing ${commands.length} command(s)...`);
      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
      console.log('✅ Commands registered successfully');
    } catch (error) {
      console.error('❌ Error registering commands:', error);
    }
  })();
};
