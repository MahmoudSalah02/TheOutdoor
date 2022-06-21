const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const dotenv = require("dotenv")
dotenv.config()

const app = express();

const url = process.env.CONNECTION_URL

mongoose.connect( url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
} );

// connecting to database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {console.log("Connected to database")});

// parsing the body
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.locals.campgrounds = campgrounds;
    res.render('campgrounds/index')
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.locals.campground = campground;
    res.render('campgrounds/show');
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.locals.campground = campground;
    res.render('campgrounds/edit');
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});

app.delete('/campgrounds/:id', async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})