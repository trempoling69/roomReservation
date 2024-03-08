const calendarRoom = require('../data/calendarRoom');
const checkavailability = require('../service/googleCalendar/checkAvailibility');
const { getEventsWithTimeMax } = require('../service/googleCalendar/getEvents');
const postEvent = require('../service/googleCalendar/postEvent');

const getAllEvent = async (req, res) => {
  const query = req.query;
  console.log(query);
  const idRoomToCheck = [];
  if (!query.salle) {
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
  let endDate;
  if (query.endDate) {
    const date = new Date(query.endDate);
    if (!isNaN(date.getTime())) {
      endDate = new Date(query.endDate).toISOString();
    }
  }
  const fetchCalendar = async (id) => {
    const response = await getEventsWithTimeMax(endDate, id);
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
    const formatHeure = (heure) => {
      const [heures, minutes, secondes] = heure.split(':').map(Number);
      const heureFormatee = `${String(heures).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
        secondes
      ).padStart(2, '0')}`;
      console.log(heureFormatee);
      return heureFormatee;
    };
    const actualDate = new Date();
    const startDate = new Date(actualDate.toISOString().split('T')[0] + 'T' + formatHeure(start));
    const endDate = new Date(actualDate.toISOString().split('T')[0] + 'T' + formatHeure(end));
    console.log(startDate, start);
    console.log(endDate, end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Erreur format de date');
    }
    const roomId = calendarRoom.find((room) => room.name === roomName)?.id;
    if (!roomId) {
      throw new Error('Pas de salle correspondante');
    }
    const availability = await checkavailability(startDate, endDate, roomId);
    if (!availability.availibility) {
      throw new Error('Salle non disponible');
    }
    const eventCreated = await postEvent(summary, startDate, endDate, description, roomId);
    if (eventCreated.status !== 200) {
      throw new Error(`Erreur lors de la création : ${eventCreated.errorMessage}`);
    }
    res.json(eventCreated);
  } catch (err) {
    console.log(err);
    res.json({ status: 500, error: err.message });
  }
};

const getStatusRoom = async (req, res) => {
  try {
    const { startCheck, endCheck } = req.query;
    const formatHeure = (heure) => {
      const [heures, minutes, secondes] = heure.split(':').map(Number);
      const heureFormatee = `${String(heures).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
        secondes
      ).padStart(2, '0')}`;
      return heureFormatee;
    };
    const actualDate = new Date();
    const startDate = new Date(actualDate.toISOString().split('T')[0] + 'T' + formatHeure(startCheck));
    const endDate = new Date(actualDate.toISOString().split('T')[0] + 'T' + formatHeure(endCheck));
    console.log(startDate, endDate);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Problème de format de date');
    }
    const allRooms = [calendarRoom[0], calendarRoom[1]];
    const formatCheckAvailability = async (startDate, endDate, calendarId, calendarName) => {
      const check = await checkavailability(startDate, endDate, calendarId);
      return {
        status: check.availibility,
        salle: calendarName,
      };
    };
    const availability = await Promise.all(
      allRooms.map((room) => formatCheckAvailability(startDate, endDate, room.id, room.name))
    );
    res.send(availability);
  } catch (err) {
    console.log(err);
    res.json({ status: 500, error: err.message });
  }
};

module.exports = { getAllEvent, createEvent, getStatusRoom };
