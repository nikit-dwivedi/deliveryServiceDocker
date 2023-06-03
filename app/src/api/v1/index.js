const express = require("express");
const router = express.Router();

require("../v1/config/mongodb");

const partnerRouter = require('./routes/partner.route.js')
const tookanRouter = require('./routes/tookan.route.js')

router.use('/partner', partnerRouter)
router.use('/tookan',tookanRouter)

module.exports = router;
