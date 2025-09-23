const express = require('express');
const router = express.Router()
const { sendmessage , getMessages , getConversations } = require('../Controllers/ChatController')
const authMiddleware = require('../Middleware/authMiddlware')

router.post('/send', authMiddleware, sendmessage)
router.get('/messages/:roomId', authMiddleware, getMessages)
router.get('/conversations/:userId', authMiddleware, getConversations)

module.exports = router;