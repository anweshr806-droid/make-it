const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// Collections
client.commands = new Collection();

// Handlers
const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');
const systemHandler = require('./handlers/systemHandler');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Load handlers
commandHandler(client);
eventHandler(client);
systemHandler(client);

client.on('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  client.user.setActivity('🎮 PRIME XP BUSINESS | Automated Economy', { type: 'PLAYING' });
});

client.login(process.env.DISCORD_TOKEN);

module.exports = client;
