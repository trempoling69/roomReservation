const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const calendarRoom = require('../../data/calendarRoom');
const checkavailability = require('../../service/googleCalendar/checkAvailibility');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('availableroom')
    .setDescription('Obtenir la liste des salles disponible actuellement')
    .addStringOption((option) =>
      option
        .setName('mintime')
        .setDescription("Ajouter le temps minimum dont vous avez besoin d'une salle")
        .setRequired(true)
        .addChoices({ name: '30 minutes', value: '30' }, { name: '1 heure', value: '60' })
    ),
  async execute(interaction) {
    const minAvailableTimeRaw = interaction.options.getString('mintime');
    const minAvailableTime = parseInt(minAvailableTimeRaw);
    const startDate = new Date();
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      startDate.getHours(),
      startDate.getMinutes() + minAvailableTime,
      59
    );
    await interaction.deferReply();
    const checkEveryAvailability = await Promise.all(
      calendarRoom.map(async (room) => {
        const available = await checkavailability(startDate, endDate, room.id);
        return {
          ...available,
          salle: room.name,
        };
      })
    );
    console.log(endDate);
    const helpEmbedsMessage = new EmbedBuilder()
      .setColor(0xffb200)
      .setAuthor({
        name: 'Maitre de la salle',
        iconURL: process.env.LINK_AVATAR_AUTOR,
      })
      .setTitle('Liste des salles disponible')
      .setDescription('Toutes les salles disponible actuellement')
      .addFields(
        ...checkEveryAvailability.map((response) => ({
          name: response.salle,
          value: response.availibility ? 'Disponible' : 'Indisponible',
        }))
      )
      .setFooter({
        text: 'Guide du bot',
        iconURL: process.env.LINK_AVATAR_AUTOR,
      })
      .setTimestamp();
    await interaction.followUp({ embeds: [helpEmbedsMessage] });
  },
};
