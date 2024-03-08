const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
require('dotenv').config();
const modalAction = require('./commands/createEvent/modalAction');
const play = require('./commands/play');
const getevent = require('./commands/getEvent');
const createEvent = require('./commands/createEvent');
const help = require('./commands/help');
const deleteEvent = require('./commands/deleteEvent');
const { generalError } = require('./messageBuilder/errorMessage');
const getActualAvailableRoom = require('./commands/getActualAvailableRoom');

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
client.commands.set(getActualAvailableRoom.data.name, getActualAvailableRoom);

client.on('ready', () => {
  console.log('Félicitations, votre bot Discord a été correctement initialisé !');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await play.execute(interaction);
  } else if (interaction.commandName === 'getevent') {
    try {
      await getevent.execute(interaction);
    } catch (err) {
      console.log(err);
      const errorRequest = generalError('/getevent');
      return interaction.followUp({ embeds: [errorRequest] });
    }
  } else if (interaction.commandName === 'create') {
    try {
      await createEvent.execute(interaction);
    } catch (err) {
      console.log(err);
      const errorRequest = generalError('/create');
      return interaction.followUp({ embeds: [errorRequest] });
    }
  } else if (interaction.commandName === 'help') {
    await help.execute(interaction);
  } else if (interaction.commandName === 'delete') {
    try {
      await deleteEvent.execute(interaction);
    } catch (err) {
      console.log(err);
      const errorRequest = generalError('/delete');
      return interaction.followUp({ embeds: [errorRequest] });
    }
  } else if (interaction.commandName === 'availableroom') {
    try {
      await getActualAvailableRoom.execute(interaction);
    } catch (err) {
      console.log(err);
      const errorRequest = generalError('/availableroom');
      return interaction.followUp({ embeds: [errorRequest] });
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === 'createEventModal') {
    await modalAction(interaction);
  }
});
module.exports = client;
