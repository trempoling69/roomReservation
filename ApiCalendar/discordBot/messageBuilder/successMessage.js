const { EmbedBuilder } = require('discord.js');
require('dotenv').config();

const descriptionMeetingGetReact = (startDate, endDate, title, description) => {
  return new EmbedBuilder()
    .setTitle('Créer une réservation')
    .setColor(0x05b200)
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setDescription('Vous venez de réaliser une demande pour reserver la salle')
    .setThumbnail(
      'https://www.shutterstock.com/image-vector/shield-protection-security-icon-vector-260nw-1410260336.jpg'
    )
    .addFields(
      { name: 'Date de début', value: `${startDate.toLocaleString('fr-FR')}`, inline: true },
      { name: 'Date de fin', value: `${endDate.toLocaleString('fr-FR')}`, inline: true }
    )
    .addFields(
      { name: 'Nom de la réservation', value: `${title}`, inline: true },
      { name: 'Description de la réservation', value: `${description}`, inline: true }
    )
    .addFields({
      name: 'Dernière chose',
      value: 'Réagissez avec 🔴 pour reserver en tant que AKANEMA et avec 🟠 pour reserver en tant que UNIVR',
    })
    .setFooter({
      text: 'Reservation de salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};

const confirmMessageSuccessPostEvent = (startDate, endDate, title, description, room, link) => {
  return new EmbedBuilder()
    .setTitle('Confirmation de réservation de la salle')
    .setColor(0x05b200)
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setDescription("Tout s'est bien déroulé, votre créneau à été réservé vous pouvez le retrouver sur l'agenda")
    .setThumbnail(
      'https://www.shutterstock.com/image-vector/shield-protection-security-icon-vector-260nw-1410260336.jpg'
    )
    .addFields(
      { name: 'Date de début', value: `${startDate.toLocaleString('fr-FR')}`, inline: true },
      { name: 'Date de fin', value: `${endDate.toLocaleString('fr-FR')}`, inline: true }
    )
    .addFields(
      { name: 'Nom de la réservation', value: `${title}` },
      { name: 'Description de la réservation', value: `${description}`, inline: true }
    )
    .addFields(
      {
        name: 'Salle reservé',
        value: `${room}`,
        inline: true,
      },
      { name: "Lien vers l'évènement", value: `${link}` }
    )
    .setFooter({
      text: 'Reservation salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};

const confirmMessageGetOneEventReactDelete = (id, title, description, startDate, endDate, company, link) => {
  return new EmbedBuilder()
    .setTitle("Confirmation de la suppression de l'évènement")
    .setColor(0xfff700)
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setDescription(`Voici l'évènement relié à cet id : ${id}`)
    .setThumbnail(
      'https://www.shutterstock.com/image-vector/shield-protection-security-icon-vector-260nw-1410260336.jpg'
    )
    .addFields(
      { name: 'Date de début', value: `${startDate.toLocaleString('fr-FR')}`, inline: true },
      { name: 'Date de fin', value: `${endDate.toLocaleString('fr-FR')}`, inline: true }
    )
    .addFields(
      { name: 'Nom de la réunion', value: `${title}` },
      { name: 'Description de la réunion', value: `${description}`, inline: true }
    )
    .addFields(
      {
        name: 'Réservez pour',
        value: `${company}`,
        inline: true,
      },
      { name: "Lien vers l'évènement", value: `${link}` }
    )
    .addFields(
      { name: 'AVERTISSEMENT', value: 'La suppression est définitive', inline: true },
      { name: 'Confirmation demandée', value: 'Réagissez par ✅ pour valider la suppression', inline: true }
    )
    .setFooter({
      text: 'Reservation salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};

const confirmationNotDeleteEvent = () => {
  return new EmbedBuilder()
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setColor(0x05b200)
    .setTitle("Confirmation de l'annulation de la suppression de l'évènement")
    .setThumbnail(process.env.LINK_AVATAR_AUTOR)
    .addFields({ name: 'Note', value: "l'évènement n'a pas été supprimé" })
    .setTimestamp()
    .setFooter({
      text: 'confirmation annulation',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    });
};

const confirmDeleteEvent = (date) => {
  return new EmbedBuilder()
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setColor(0x05b200)
    .setTitle(`Confirmation de suppression de l'évènement du ${date}`)
    .setThumbnail(process.env.LINK_AVATAR_AUTOR)
    .addFields(
      { name: 'Note', value: "L'évènement a été supprimé avec succès", inline: true },
      { name: 'Commentaire', value: 'Entre nous, il devait pas être si important que ça', inline: true }
    )
    .setTimestamp()
    .setFooter({
      text: 'confirmation suppression',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    });
};

const successModalCreateEvent = (startDate, endDate, title, description, room) => {
  return new EmbedBuilder()
    .setTitle('Créer une réservation')
    .setColor(0x05b200)
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setDescription('Vous venez de réaliser une demande pour reserver une salle')
    .setThumbnail(
      'https://www.shutterstock.com/image-vector/shield-protection-security-icon-vector-260nw-1410260336.jpg'
    )
    .addFields(
      { name: 'Date de début', value: `${startDate.toLocaleString('fr-FR')}`, inline: true },
      { name: 'Date de fin', value: `${endDate.toLocaleString('fr-FR')}`, inline: true }
    )
    .addFields(
      { name: 'Nom de la réunion', value: `${title}`, inline: true },
      { name: 'Description de la réunion', value: `${description}`, inline: true },
      { name: 'Salle', value: `${room}`, inline: true }
    )
    .addFields({
      name: 'Dernière chose',
      value: 'Réagissez avec ✅ pour valider la réservation et avec ❌ pour annuler la reservation',
    })
    .setFooter({
      text: 'Reservation de salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};

const successDismissEvent = () => {
  return new EmbedBuilder()
    .setTitle('Annulation de la création')
    .setColor(0x05b200)
    .setAuthor({
      name: 'Maitre de la salle',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setDescription(
      "Vous venez d'annuler votre demande de reservation pour la salle. Aucun créneau n'a été reservé. Vous pouvez réessayer ou vaquer à vos occupations."
    )
    .setFooter({
      text: 'Annulation reservation salle réunion',
      iconURL: process.env.LINK_AVATAR_AUTOR,
    })
    .setTimestamp();
};

module.exports = {
  descriptionMeetingGetReact,
  confirmMessageSuccessPostEvent,
  confirmMessageGetOneEventReactDelete,
  confirmationNotDeleteEvent,
  confirmDeleteEvent,
  successModalCreateEvent,
  successDismissEvent,
};
