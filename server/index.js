const express = require("express")
const {User, Message} = require("./schema/schema")
const http = require("http")
const {Server} = require("socket.io")
const app = express()
const cors = require("cors")
require("./db")
const authentication = require("./routes/authentication")
const userFriends = require("./routes/userFriends")
const messages = require("./routes/message")
const bodyParser = require("body-parser");

app.use(bodyParser.json())
app.use(cors())

app.use("/api/v1", userFriends)
app.use("/api/v1", authentication)
app.use("/api/v1", messages)
app.use(express.json())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    // console.log(`user connected: ${socket.id}`)
    socket.on("send_message", async({message, recipient_Id, userId}) => {
        // console.log("RECIPIENT ID",recipient_Id)
        try {
            const recipient = await User.findOne({_id: recipient_Id})
            // console.log("THIS IS THE RECIPIENT SOCKET_id", (recipient.socket_id))
            // console.log(recipient)
            if(recipient) {
                    const newMessage = await Message.create({
                        message: message,
                        isSender: true, 
                        recipient: recipient._id,
                        sender: userId
                    })  
                    if(recipient_Id === newMessage.recipient.toString() && userId === newMessage.sender.toString()) {
                        io.to(recipient.socket_id).emit("receive_message", { message: newMessage, socket_id: recipient.socket_id });
                        // console.log(`message: ${newMessage.message}; socket_Id: ${recipient.socket_id}; username: ${recipient.username}`)
                    }  
            }
        } catch (error) {
            console.error(error)
        }
    })

    socket.on("store_message", async({message, recipient_Id, userId}) => {
        console.log()
        try {
            await Message.create({
                message: message,
                isSender: false, 
                recipient: recipient_Id,
                sender: userId
            }) 
        } catch (error) {
            console.error(error)
        }
    })

    socket.on("authenticate",async ({userId}) => {
        // console.log(userId ? `'this is the' ${userId}` : "no userId")
        try {

            const user = await User.findById(userId)
            // console.log(user)
            if(user) {
                user.socket_id = socket.id
                await user.save()
                // console.log(user.socket_id)
            }
            const user2 = await User.findById(userId)
            // console.log(user2)
        } catch (error) {
            console.error(error)
        }
    })
    socket.on("stopTyping", async ({ recipientId }) => {
        try {
            const recipient = await User.findOne({ _id: recipientId });
            if (recipient) {
                io.to(recipient.socket_id).emit("user_typing", { message: "" });
            }
        } catch (error) {
            console.error(error);
        }
    });
    
    socket.on("typing", async ({ username, recipientId }) => {
        try {
            const recipient = await User.findOne({ _id: recipientId });
            if (recipient) {
                io.to(recipient.socket_id).emit("user_typing", { message: `${username} is typing...` });
            }
        } catch (error) {
            console.error(error);
        }
    });
    

    socket.on("disconnect", async() => {
        try {
            const user = await User.findOne({socket_id: socket.id})
            if (user) {
                user.socket_id = ""
                await user.save()
                // console.log(user.socket_id)
            }
        } catch(error) {
            console.error(error)
        }
    })
})

server.listen(3001, () => {
    console.log("server listening on port: 3001")
})