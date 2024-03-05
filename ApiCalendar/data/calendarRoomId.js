require('dotenv').config();
const calendarRoomId = [
  {
    name: 'Salle 1',
    id: process.env.SALLE_1_CALENDAR_ID,
  },
  {
    name: 'Salle 2',
    id: process.env.SALLE_2_CALENDAR_ID,
  },
];

module.exports = calendarRoomId;
