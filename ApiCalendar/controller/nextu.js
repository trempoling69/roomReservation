const { default: axios } = require('axios');
require('dotenv').config();
const cheerio = require('cheerio');
const FormData = require('form-data');
const campusKeyWord = ['Next-U Café', 'Campus'];
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const getCalendar = async (req, res) => {
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
  formData.append('start', '2024-03-03T23:00:00.000Z');
  formData.append('duration', '1');
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
  const newEvent = allEvents.map((event) => {
    return {
      ...event,
      salle: event.Planification.replaceAll('\r', '')
        .replaceAll('<br />', '')
        .split('\n')
        .find((el) => campusKeyWord.some((keyword) => el.includes(keyword))),
    };
  });

  res.send(newEvent);
};

module.exports = getCalendar;
