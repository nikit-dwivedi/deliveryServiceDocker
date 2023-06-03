const express = require('express');
const router = express.Router();

const partnerController = require('../controllers/partner.controller.js');
const { authenticatePartner } = require('../middlewares/authToken.js');

router.post('/create', partnerController.addToRoam);
router.post('/task', partnerController.createTask);
router.get('/task', partnerController.partnerTask);
router.post('/task/status', authenticatePartner, partnerController.changeStatus);
router.get('/status', authenticatePartner, partnerController.changeDutyStatus);
router.get('/detail', authenticatePartner, partnerController.getPartnerDetails);
module.exports = router