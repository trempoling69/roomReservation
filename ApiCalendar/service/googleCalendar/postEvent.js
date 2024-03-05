const calendar = require('./googleCalendar.js');
const checkavailability = require('./checkAvailibility.js');
const calendarRoomId = require('../../data/calendarRoomId.js');
require('dotenv').config();

const postEvent = async (summary, start, end, description, room) => {
  const response = { status: null, htmlLink: null, errorMessage: null };
  try {
    const isAvailable = await checkavailability(start, end);
    if (isAvailable.availibility) {
      const event = {
        summary: summary,
        start: {
          dateTime: start.toISOString(),
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: 'Europe/Paris',
        },
        description,
        sendUpdates: 'all',
      };
      const resp = await calendar.events.insert({ calendarId: calendarRoomId[room], resource: event });
      response.status = resp.status;
      response.htmlLink = resp.data.htmlLink;
    }
  } catch (err) {
    console.log(err);
    response.status = err.code;
    response.errorMessage = err.errors[0]?.message;
  }
  return response;
};

module.exports = postEvent;
