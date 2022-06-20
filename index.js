const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const dotenv = require("dotenv")
dotenv.config()

const url = process.env.CONNECTION_URL

mongoose.connect( url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
} );

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("Connected to database")});

app.set('view engine', 'ejs');
app.set('views', path.join)

app.get('/', (req, res) => {
    res.send("Hello!")
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})