const mongoose = require("mongoose")

const url = `mongodb+srv://okaforchidubem7:basicchat@cluster0.ecigull.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(url, {
  socketTimeoutMS: 30000 
})

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

module.exports = {db}