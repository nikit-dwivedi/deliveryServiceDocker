const express = require('express');
const router = express.Router();

const tookanController = require('../controllers/tookan.controller.js');

router.post('/task/create', tookanController.createTask);
router.post('/task/event',  tookanController.getEvents);
module.exports = router