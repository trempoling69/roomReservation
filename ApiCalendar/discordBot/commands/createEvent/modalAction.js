const {
  errorFormatDateReservation,
  errorAvailibityMeetingRoom,
  errorGeneralRequest,
} = require('../../messageBuilder/errorMessage');
const checkavailability = require('../../../service/googleCalendar/checkAvailibility');
const {
  confirmMessageSuccessPostEvent,
  successModalCreateEvent,
  successDismissEvent,
} = require('../../messageBuilder/successMessage');
const postEvent = require('../../../service/googleCalendar/postEvent');
const calendarRoom = require('../../../data/calendarRoom');

const modalAction = async (interaction) => {
  const startDateString = interaction.fields.getTextInputValue('EventStartDate');
  const endDateString = interaction.fields.getTextInputValue('EventEndDate');
  const title = interaction.fields.getTextInputValue('EventTitle');
  const description = interaction.fields.getTextInputValue('EventDescription');
  const roomId = interaction.fields.getTextInputValue('Eventroom');
  const roomName = calendarRoom.find((room) => room.id === roomId)?.name;
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    const error = errorFormatDateReservation;
    return interaction.reply({ embeds: [error] });
  }
  const availibility = await checkavailability(startDate, endDate, roomId);
  if (availibility.status !== 200) {
    const errorRequest = errorGeneralRequest(
      'durant la requête de vérification de disponibilité',
      `La requête n'a pas pu aboutir correctement, elle a renvoyé le code erreur ${availibility.status}`,
      availibility.error
    );
    return interaction.reply({ embeds: [errorRequest] });
  }
  if (!availibility.availibility) {
    const error = errorAvailibityMeetingRoom;
    return interaction.reply({ embeds: [error] });
  }
  const collectorFilter = (reaction, user) => {
    return ['✅', '❌'].includes(reaction.emoji.name) && user.id === interaction.user.id;
  };
  const askValidation = successModalCreateEvent(startDate, endDate, title, description, roomName);
  const validationMessage = await interaction.reply({ embeds: [askValidation], fetchReply: true });
  await Promise.all([validationMessage.react('✅'), validationMessage.react('❌')]);
  const collected = await validationMessage.awaitReactions({
    filter: collectorFilter,
    max: 1,
    time: 60000,
    errors: ['time'],
  });
  const reaction = collected.first();
  if (reaction.emoji.name === '✅') {
    const postEventReponse = await postEvent(title, startDate, endDate, description, roomId);
    if (postEventReponse.status === 200) {
      interaction.channel.bulkDelete([validationMessage.id], true);
      const confirmationMessage = confirmMessageSuccessPostEvent(
        startDate,
        endDate,
        title,
        description,
        roomName,
        postEventReponse.htmlLink
      );
      interaction.channel.send({ embeds: [confirmationMessage] });
    } else {
      const errorEmbed = errorGeneralRequest(
        "durant la requête de création d'évènement",
        `Je suis moins smart que chatGPT alors si le code erreur te dis rien j'ai peur de pas être d'une grande aide. (code: ${postEventReponse.status})`,
        postEventReponse.errorMessage
      );
      interaction.channel.send({ embeds: [errorEmbed] });
    }
  } else {
    interaction.channel.bulkDelete([validationMessage.id], true);
    const confirmNoReservation = successDismissEvent();
    interaction.channel.send({ embeds: [confirmNoReservation] });
  }
};

module.exports = modalAction;
