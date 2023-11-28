const express = require('express');
const bodyParser = require('body-parser');
const app = express();


const PORT = process.env.PORT || 3000;


const generateWebsiteRoute = require('./routes/generate-website.js');

require('dotenv').config();




// Middleware to parse URL-encoded body data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));



// route to handle the generate website
app.use('/', generateWebsiteRoute);


// Start the server and store the server object
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

