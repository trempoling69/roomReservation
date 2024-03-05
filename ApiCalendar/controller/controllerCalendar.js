const calendarRoomId = require('../data/calendarRoomId');
const { getEventsLifeTime } = require('../service/googleCalendar/getEvents');

const getAllEvent = async (req, res) => {
  const query = req.query;
  console.log(query);
  const idRoomToCheck = [];
  if (Object.keys(query).length === 0) {
    const allValues = Object.values(calendarRoomId);
    allValues.map((id) => idRoomToCheck.push(id));
  } else {
    const roomToCheck = query.salle;
    if (Array.isArray(roomToCheck)) {
      roomToCheck.map((name) => {
        const idRoom = calendarRoomId[name];
        if (idRoom) {
          idRoomToCheck.push(idRoom);
        }
      });
    } else {
      const idRoom = calendarRoomId[roomToCheck];
      if (idRoom) {
        idRoomToCheck.push(idRoom);
      }
    }
  }
  console.log(idRoomToCheck);
  const fetchCalendar = async (id) => {
    const response = await getEventsLifeTime(id);
    return response;
  };
  const responses = await Promise.all(idRoomToCheck.map((id) => fetchCalendar(id)));
  // console.log(responses);
  // const rowEvents = await getEventsLifeTime();
  // const formatEvents = rowEvents.map((event) => {
  //   return {
  //     startDate: event.start.dateTime,
  //     endDate: event.end.dateTime,
  //     title: event.summary,
  //   };
  // });
  res.json(responses);
};

const createEvent = (req, res) => {
  const eventData = req.body;
  res.send(eventData);
};

module.exports = { getAllEvent, createEvent };
