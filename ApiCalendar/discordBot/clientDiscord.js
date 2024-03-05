const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
require('dotenv').config();
const modalAction = require('./commands/createEvent/modalAction');
const play = require('./commands/play');
const getevent = require('./commands/getEvent');
const createEvent = require('./commands/createEvent');
const help = require('./commands/help');
const deleteEvent = require('./commands/deleteEvent');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.commands = new Collection();

client.commands.set(play.data.name, play);
client.commands.set(getevent.data.name, getevent);
client.commands.set(createEvent.data.name, createEvent);
client.commands.set(help.data.name, help);
client.commands.set(deleteEvent.data.name, deleteEvent);

client.on('ready', () => {
  console.log('Félicitations, votre bot Discord a été correctement initialisé !');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await play.execute(interaction);
  } else if (interaction.commandName === 'getevent') {
    await getevent.execute(interaction);
  } else if (interaction.commandName === 'create') {
    await createEvent.execute(interaction);
  } else if (interaction.commandName === 'help') {
    await help.execute(interaction);
  } else if (interaction.commandName === 'delete') {
    await deleteEvent.execute(interaction);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === 'createEventModal') {
    await modalAction(interaction);
  }
});
module.exports = client;
