const calendar = require('./googleCalendar.js');
require('dotenv').config();

const deleteEventRequest = async (eventId, calendarId) => {
  const response = { status: null, error: null };
  try {
    const resp = await calendar.events.delete({ calendarId: calendarId, eventId: eventId });
    response.status = resp.status;
  } catch (err) {
    console.log(err);
    response.status = err.code;
    response.error = err.errors[0]?.message;
  }
  return response;
};
module.exports = deleteEventRequest;
