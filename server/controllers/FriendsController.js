const {User, Friend} = require("../schema/schema")

class FriendsController {

  static async AddFriend(req, res) {
    try {
      const { userId, friendId } = req.params;
  
      const updatedFriend = await Friend.findOneAndUpdate(
        { user: userId },
        { $push: { friendId } },
        { new: true }
      ).populate('user');
  
      if (!updatedFriend) {
        const initializeFriendSchema = new Friend({
          user: userId,
          friendId
        })
        const newFriend = await initializeFriendSchema.save()
        return res.status(200).json({ message: "Friend added", data: newFriend });
      }
  
      res.status(200).json({ message: "Friend added", data: updatedFriend });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", data: error });
    }
  }
  
  static async GetFriends(req, res) {
    try {
        const { userId } = req.params;
        const friends = await Friend.find({ user: userId });

        if (!friends || friends.length === 0 || !friends[0].friendId  || userId === undefined) {
          return res.status(409).json({ message: "lonely" });
        }

        const { friendId } = friends[0];
        let fetchUserFromId = [];

        for (let i = 0; i < friendId.length; i++) {
            fetchUserFromId.push(await User.findOne({ _id: friendId[i] }));
        }
        res.status(200).json({ message: "success", data: fetchUserFromId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error", data: error });
    }
}
}

module.exports = FriendsController