const {Message} = require("../schema/schema")

class MessageController {
    static async getMessage(req,res) {
        try {
            const {recipientId, userId} = req.params
            console.log(`userId: ${userId}; recipientId: ${recipientId}`)
            const messages = await Message.find({ $and: [{ sender: userId }, { recipient: recipientId }] })
            console.log(messages)
            if(!messages) {
                res.status(404).json({message: "chat history does not exist"})
            } 
            res.status(200).json({message: "message retrieved", data: messages})
        } catch (error) {
            console.error(error)
            res.status(500).json({message: "Internal server error"})
        }
    }
}

module.exports = MessageController