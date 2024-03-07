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
  {
    name: 'La City',
    id: process.env.LA_CITY_CALENDAR_ID,
  },
  {
    name: 'Open Space',
    id: process.env.OPEN_SPACE_CALENDAR_ID,
  },
];

module.exports = calendarRoom;
