const express = require('express');
const { getAllEvent, createEvent } = require('../controller/controllerCalendar');
const router = express.Router();

router.get('/', getAllEvent);
router.post('/', createEvent);

module.exports = router;
