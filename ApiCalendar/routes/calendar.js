const express = require('express');
const { getAllEvent, createEvent, getStatusRoom } = require('../controller/controllerCalendar');
const getCalendar = require('../controller/nextu');
const router = express.Router();

router.get('/', getAllEvent);
router.post('/', createEvent);
router.get('/next', getCalendar);
router.get('/status', getStatusRoom);

module.exports = router;
