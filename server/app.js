
// load variables from .env file if not in production mode 
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/sironix';

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const path = require('path');
const passport = require('passport');
const PORT = process.env.PORT || 2999;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
const generateWebsiteRoute = require('./routes/web/generate-website.js');
const imageUploadRoute = require('./routes/web/uploadDocuments.js');
const googleAuthRoute = require('./routes/web/googleAuth.js');
const loadWebsiteRoute = require('./routes/web/load-website.js');
const apiGenerateResume = require('./routes/Api/api-generate-resume.js');
const navigateWebsiteRoute = require('./routes/web/navigateWebsite.js');
const session = require('express-session');
const { isLoggedIn } = require('./utils/middleware.js')
const User = require('../models/User.js');
const AppError = require('./routes/routeErrors/AppError');

function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}

//uncomment in production
// app.use(requireHTTPS);



app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: dbUrl
    }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.authenticate('session'));





// Middleware to parse URL-encoded body data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, '..', 'public')));


//store user in session
passport.serializeUser((user, done) => {
    done(null, { id: user.id });
});

//retrieve user from session
passport.deserializeUser(async (data, done) => {
    try {

        const user = await User.findById(data.id); // Use the ID to find the user
        if (!user) {
            throw new Error('User not found');
        }
        done(null, user); // The complete user object is now available in req.user
    } catch (err) {
        done(err);
    }
});


//to use in the ejs files if i need 
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});




app.get('/', (req, res) => {
    // Render the home page or redirect, etc. and pass the promo code
    res.render('home');
});

app.get('/home', (req, res) => {
    // Render the home page or redirect, etc. and pass the promo code
    res.render('home');
});

app.get('/toolLogin', (req, res) => {
    res.render('toolLogin');
});

app.get('/tool', isLoggedIn, (req, res) => {
    res.render('tool');
});



// route to handle the generate website
app.use('/', generateWebsiteRoute);
// route to handle image upload
app.use('/', imageUploadRoute);
// route to handle google auth
app.use('/', googleAuthRoute);
// route to handle loading website
app.use('/', loadWebsiteRoute);
// route to handle api generate resume
app.use('/', apiGenerateResume);
// route to handle navigation
app.use('/', navigateWebsiteRoute);





// Connect to MongoDB and then start the server
mongoose.connect(dbUrl)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server started successfully, listening at http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.log('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process with failure code
    });

// Global error handling middleware
app.use((err, req, res, next) => {
    // Check if error is an instance of AppError
    if (err instanceof AppError) {
        return res.status(err.status).json({ success: false, message: err.message });
    }

    // For other types of errors, you might want to log them or handle them differently
    console.error('An error occurred:', err);

    // Send a generic error response
    res.status(500).json({ success: false, message: 'An unexpected error occurred' });
});
