const mongoose = require('mongoose')
const connectionString = "mongodb+srv://danghieu1407:hieu0947072684@cluster0.ga1ro.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
if (!connectionString){
    console.error('MongoDB connection string missing!')
    process.exit(1)
}

mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', err => {
    console.error('MongooseDB error: ' +err.message)
})

db.once('open', () => console.log('MongoDB connection established'))

