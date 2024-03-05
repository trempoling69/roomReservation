const { getEventsLifeTime } = require('../service/googleCalendar/getEvents');

const getAllEvent = async (req, res) => {
  const rowEvents = await getEventsLifeTime();
  const formatEvents = rowEvents.map((event) => {
    return {
      startDate: event.start.dateTime,
      endDate: event.end.dateTime,
      title: event.summary,
    };
  });
  res.json(rowEvents);
};

const createEvent = (req, res) => {
  const eventData = req.body;
  res.send(eventData);
};

module.exports = { getAllEvent, createEvent };
