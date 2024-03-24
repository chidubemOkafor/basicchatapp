const {Schema, model, default: mongoose} = require("mongoose")


const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    socket_id: {type: String}
})

const userMessage = new Schema({
    message: { type: String, required: true },
    isSender: {type: Boolean, default: false},
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const userFriends = new Schema({
    friendId: [{type: String}],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}) 

const User = model("User", userSchema)
const Message = model("Message", userMessage)
const Friend = model("Friend", userFriends)

module.exports = {User, Message, Friend}