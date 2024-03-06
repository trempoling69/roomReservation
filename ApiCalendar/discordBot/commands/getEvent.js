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
    const inputRoom = interaction.options.getString('room');
    let roomArrayId = [];
    if (inputRoom === 'all') {
      calendarRoom.map((room) => roomArrayId.push(room.id));
    } else {
      roomArrayId.push(inputRoom);
    }
    const currentDate = new Date();
    let timeMax;
    await interaction.deferReply();
    console.log(period);
    switch (period) {
      case 'day':
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);
        timeMax = endDate.toISOString();
        break;
      case 'week':
        const endOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
        timeMax = endOfWeek.toISOString();
        break;
      default:
        timeMax = undefined;
        break;
    }
    console.log(timeMax);
    const fetchCalendar = async (id) => {
      const response = await getEventsWithTimeMax(timeMax, id);
      return response;
    };
    const rowEvents = await Promise.all(roomArrayId.map((id) => fetchCalendar(id)));
    const events = [];
    rowEvents.map((roomEvent) => {
      return roomEvent.map((event) => {
        events.push(event);
      });
    });
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
    const room = calendarRoom.find((room) => room.id === event.organizer.email)?.name || 'Erreur salle';
    if (event.start.dateTime === undefined) {
      start = new Date(event.start.date).toLocaleString('fr-FR');
      end = new Date(event.end.date).toLocaleString('fr-FR');
    } else {
      start = new Date(event.start.dateTime).toLocaleString('fr-FR');
      end = new Date(event.end.dateTime).toLocaleString('fr-FR');
    }

    const eventText =
      `${eventIndex}. [${event.id}] - ${event.summary}\n` +
      `   - Date de début : ${start}\n` +
      `   - Date de fin : ${end}\n` +
      `   - Salle : ${room} \n\n`;

    eventList += eventText;
  });
  return eventList;
};
