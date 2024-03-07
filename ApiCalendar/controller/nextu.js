const { default: axios } = require('axios');
require('dotenv').config();
const cheerio = require('cheerio');
const FormData = require('form-data');
const campusKeyWord = ['Next-U Café', 'Campus'];
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const response = require('./fakeRes');
const calendarRoom = require('../data/calendarRoom');
const { getSpecificRangeEvents } = require('../service/googleCalendar/getEvents');
const postEvent = require('../service/googleCalendar/postEvent');
const deleteEventRequest = require('../service/googleCalendar/deleteEvent');
const getCalendar = async (req, res) => {
  try {
    const { startDate } = req.query;
    if (!startDate) {
      throw new Error('Donner une date de départ');
    }
    const startRequestDate = new Date(startDate);
    if (isNaN(startRequestDate.getTime())) {
      throw new Error('Problème dans le format des dates');
    }
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar }));
    const response = await client.get('https://nextu.myintranet.online/login?ReturnUrl=%2F', {
      headers: { Connection: 'keep-alive' },
    });
    const $ = cheerio.load(response.data);
    const $inputToken = $('input[type="hidden"]').attr('value');
    const formDataLogin = new FormData();
    formDataLogin.append('UserName', process.env.USERNAME_NEXT);
    formDataLogin.append('Password', process.env.PASSWORD_NEXT);
    formDataLogin.append('__RequestVerificationToken', $inputToken);
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://nextu.myintranet.online/User/LoginPost?ReturnUrl=%2F',
      headers: {
        Origin: 'https://nextu.myintranet.online',
        Referer: 'https://nextu.myintranet.online/login?ReturnUrl=%2F',
        authority: 'nextu.myintranet.online',
        ...formDataLogin.getHeaders(),
      },
      data: formDataLogin,
    };
    await client.request(config);

    const formData = new FormData();
    formData.append('start', startRequestDate.toISOString());
    formData.append('duration', '7');
    const data = await client.post('https://nextu.myintranet.online/Calendar/LoadEvents', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        origin: 'https://nextu.myintranet.online',
        referer: 'https://nextu.myintranet.online/Calendar',
        authority: 'nextu.myintranet.online',
        ...formData.getHeaders(),
      },
    });
    const allEvents = data.data;
    // const allEvents = response;
    console.log(data);
    console.log(allEvents);
    const newEvent = allEvents.map((event) => {
      return {
        ...event,
        salle: event.Planification.replaceAll('\r', '')
          .replaceAll('<br />', '')
          .split('\n')
          .find((el) => campusKeyWord.some((keyword) => el.includes(keyword))),
      };
    });
    const removeKeywords = (inputString, keywords) => {
      const regex = new RegExp(keywords.join('|'), 'gi');
      const resultString = inputString.replace(regex, '');
      const newString = resultString.replace('-', '');
      return newString.trim();
    };
    const doubleEvent = newEvent.map((event) => {
      return {
        ...event,
        salle: event?.salle && removeKeywords(event?.salle, campusKeyWord),
      };
    });

    const addToGgCalendar = async (event) => {
      const salleName = event.salle;
      const calendarId = calendarRoom.find((room) => room.name === salleName)?.id;
      if (calendarId) {
        const startCours = new Date(event.Debut);
        const endCours = new Date(event.Fin);
        const eventAlreadyExist = await getSpecificRangeEvents(startCours, endCours, calendarId);
        if (eventAlreadyExist.length !== 0) {
          const deleteAllEvent = await Promise.all(
            eventAlreadyExist.map((event) => deleteEventRequest(event.id, calendarId))
          );
          console.log(deleteAllEvent);
        }
        const createInGgCalendar = await postEvent(
          event.Planification.split('\r')[0],
          startCours,
          endCours,
          event.Planification,
          calendarId
        );
        return createInGgCalendar;
      }
    };
    console.log(doubleEvent);
    const EventCheck = await Promise.all(
      doubleEvent.filter((event) => event.salle !== undefined).map((event) => addToGgCalendar(event))
    );
    res.send(EventCheck);
  } catch (err) {
    console.log(err);
    res.json({ message: `Erreur dans la requête : ${err.message}`, status: 500 });
  }
};

module.exports = getCalendar;
