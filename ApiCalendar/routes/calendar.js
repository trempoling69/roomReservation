const express = require('express');
const { getAllEvent } = require('../controller/controllerCalendar');
const postEvent = require('../service/googleCalendar/postEvent');
const router = express.Router();

router.get('/', getAllEvent);
router.post('/', postEvent);

module.exports = router;
