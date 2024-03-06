require('dotenv').config();
const calendarRoom = [
  {
    name: 'Salle_1',
    id: process.env.SALLE_1_CALENDAR_ID,
  },
  {
    name: 'Salle_2',
    id: process.env.SALLE_2_CALENDAR_ID,
  },
];

module.exports = calendarRoom;
