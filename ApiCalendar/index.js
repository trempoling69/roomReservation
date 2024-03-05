require('dotenv').config();
const { REST, Routes } = require('discord.js');
const token = process.env.TOKEN_DISCORD;
const CLIENT_ID = process.env.CLIENT_ID_DISCORD;
const GUILD_ID = process.env.GUILD_ID_DISCORD;
const express = require('express');

const app = express();
const port = 3000;

const client = require('./discordBot/clientDiscord');
const { getEventsLifeTime } = require('./service/googleCalendar/getEvents');
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: client.commands.map((command) => command.data.toJSON()),
    });
    client.login(token);
  } catch (err) {
    console.log(err);
  }
})();

const calendarRoutes = require('./routes/calendar');

app.use('/calendar', calendarRoutes);

app.listen(port, () => {
  console.log(`Serveur Express écoutant sur le port ${port}`);
});
