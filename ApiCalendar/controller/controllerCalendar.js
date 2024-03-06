const calendarRoom = require('../data/calendarRoom');
const { getEventsLifeTime } = require('../service/googleCalendar/getEvents');
const postEvent = require('../service/googleCalendar/postEvent');

const getAllEvent = async (req, res) => {
  const query = req.query;
  console.log(query);
  const idRoomToCheck = [];
  if (Object.keys(query).length === 0) {
    calendarRoom.map((room) => idRoomToCheck.push(room.id));
  } else {
    const roomToCheck = query.salle;
    if (Array.isArray(roomToCheck)) {
      roomToCheck.map((name) => {
        const roomToFind = calendarRoom.find((room) => room.name === name);
        if (roomToFind) {
          idRoomToCheck.push(roomToFind.id);
        }
      });
    } else {
      const idRoom = calendarRoom.find((room) => room.name === roomToCheck)?.id;
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
  const rowEvents = await Promise.all(idRoomToCheck.map((id) => fetchCalendar(id)));
  const allEvents = [];
  rowEvents.map((roomEvent) => {
    return roomEvent.map((event) => {
      const formatEvent = {
        startDate: event.start.dateTime,
        endDate: event.end.dateTime,
        title: event.summary,
        salle: calendarRoom.find((room) => room.id === event.organizer.email)?.name,
      };
      allEvents.push(formatEvent);
    });
  });
  res.json(allEvents);
};

const createEvent = async (req, res) => {
  try {
    const { summary, start, end, description, roomName } = req.body;
    const roomId = calendarRoom.find((room) => room.name === roomName);
    if (!roomId) {
      throw new Error('Pas de salle correspondante');
    }
    const eventCreated = await postEvent(summary, start, end, description, roomId);
    if (eventCreated.status !== 200) {
      throw new Error(`Erreur lors de la création : ${eventCreated.errorMessage}`);
    }
    res.send(eventCreated);
  } catch (err) {}
};

module.exports = { getAllEvent, createEvent };
