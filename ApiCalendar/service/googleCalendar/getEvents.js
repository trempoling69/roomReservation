const calendar = require('./googleCalendar.js');
require('dotenv').config();
const getEventsWithTimeMax = async (timeMax, calendarId) => {
  try {
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (err) {
    throw err;
  }
};
const getEventsLifeTime = async (calendarId) => {
  try {
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (err) {
    throw err;
  }
};

const getSpecificRangeEvents = async (startTime, endTime, calendarId) => {
  try {
    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items;
  } catch (err) {
    throw err;
  }
};
module.exports = {
  getEventsWithTimeMax,
  getEventsLifeTime,
  getSpecificRangeEvents,
};
