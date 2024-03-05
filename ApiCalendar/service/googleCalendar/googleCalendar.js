const { google } = require('googleapis');
const privatekey = require('../../apidiscordcalendar-18715d298531.json');

const jwtClient = new google.auth.JWT(privatekey.client_email, null, privatekey.private_key, [
  'https://www.googleapis.com/auth/calendar',
]);

jwtClient.authorize((err, tokens) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Connexion réussie à google Agenda!');
});

const calendar = google.calendar({ version: 'v3', auth: jwtClient });

module.exports = calendar;
