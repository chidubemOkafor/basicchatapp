const express = require("express")
const router = express.Router()
const MessageController = require("../controllers/MessageController")


router.get("/getMessage/:recipientId/:userId", MessageController.getMessage)



module.exports = router