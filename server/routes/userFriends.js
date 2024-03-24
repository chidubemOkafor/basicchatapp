const express = require("express")
const router = express.Router()
const FriendsController = require("../controllers/FriendsController")


router.post("/addFriends/:userId/:friendId", FriendsController.AddFriend)
router.get("/getFriends/:userId", FriendsController.GetFriends)

module.exports = router