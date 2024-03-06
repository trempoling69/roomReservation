const { SlashCommandBuilder } = require('discord.js');
const { getEventsWithTimeMax, getEventsLifeTime } = require('../../service/googleCalendar/getEvents');
const calendarRoom = require('../../data/calendarRoom');
const chunkSize = 5;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getevent')
    .setDescription('Obtenir les évènements à venir')
    .addStringOption((option) =>
      option
        .setName('room')
        .setDescription("Vérifier la disponibilité d'une salle en particulier")
        .setRequired(true)
        .addChoices(
          { name: 'Toutes', value: 'all' },
          ...calendarRoom.map((obj) => {
            return { name: obj.name, value: obj.id };
          })
        )
    )
    .addStringOption((option) =>
      option
        .setName('period')
        .setDescription('Période sur laquelle filtrer le resultat')
        .setRequired(true)
        .addChoices(
          { name: 'Jour', value: 'day' },
          { name: 'Semaine', value: 'week' },
          { name: 'All time', value: 'alltime' }
        )
    ),
  async execute(interaction) {
    const period = interaction.options.getString('period');
    const roomId = interaction.options.getString('room');
    console.log(period);
    const currentDate = new Date();
    let timeMax;
    await interaction.deferReply();
    switch (period) {
      case 'day':
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
        timeMax = endDate.toISOString();
      case 'week':
        const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
        timeMax = endOfWeek.toISOString();
      default:
        timeMax = undefined;
    }
    // if (period === 'day') {
    //   const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
    //   timeMax = endDate.toISOString();
    // }
    // if (period === 'week') {
    //   const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
    //   timeMax = endOfWeek.toISOString();
    // }
    // let events;
    // if (period === 'day' || period === 'week') {
    //   events = await getEventsWithTimeMax(timeMax);
    // } else {
    //   events = await getEventsLifeTime();
    // }
    const events = await getEventsWithTimeMax(timeMax, roomId);
    if (events.length) {
      const eventChunks = chunkEvents(events);
      eventChunks.forEach((eventChunk, index) => {
        const reponse = formatEventChunk(eventChunk, index);
        interaction.followUp(reponse);
      });
    } else {
      await interaction.followUp('Aucun événement trouvé.');
    }
  },
};

const chunkEvents = (events) => {
  const eventChunks = [];
  for (let i = 0; i < events.length; i += chunkSize) {
    const chunk = events.slice(i, i + chunkSize);
    eventChunks.push(chunk);
  }
  return eventChunks;
};

const formatEventChunk = (eventChunk, chunkNumber) => {
  let eventList = 'Liste des événements :\n\n';
  const multiplier = chunkNumber * chunkSize;
  eventChunk.forEach((event, index) => {
    const eventIndex = multiplier + index + 1;
    let start;
    let end;
    if (event.start.dateTime === undefined) {
      start = new Date(event.start.date).toLocaleString();
      end = new Date(event.end.date).toLocaleString();
    } else {
      start = new Date(event.start.dateTime).toLocaleString();
      end = new Date(event.end.dateTime).toLocaleString();
    }

    const eventText =
      `${eventIndex}. [${event.id}] - ${event.summary}\n` +
      `   - Date de début : ${start}\n` +
      `   - Date de fin : ${end}\n` +
      `   - Salle : TODO \n\n`;

    eventList += eventText;
  });
  return eventList;
};
