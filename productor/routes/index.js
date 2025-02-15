const express = require('express');
const { setMessage, getAllMessages, getLastMessage } = require('../controllers');

const router = express.Router();

router.post('/set', setMessage);
router.get('/all', getAllMessages);
router.get('/get', getLastMessage);

module.exports = router;