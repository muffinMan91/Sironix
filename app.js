const express = require('express');
const openai = require('./services/openaiClient');
const bodyParser = require('body-parser');
const app = express();
let userData = {};

const PORT = process.env.PORT || 3000;

const generateCoverLetterRoute = require('./routes/generate-coverLetter.js')(userData);
const generateResumeRoute = require('./routes/generate-resume.js')(userData);
const generateWebsiteRoute = require('./routes/generate-website.js')(userData);

require('dotenv').config();




// Middleware to parse URL-encoded body data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Route to handle the root URL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
// route to handle the generate website
app.use('/', generateWebsiteRoute);
// route to handle the generate resume
app.use('/', generateResumeRoute);
// route to handle the generate cover letter
app.use('/', generateCoverLetterRoute);


// Route to handle form submission
app.post('/submit-form', (req, res) => {
    //if you did userData = req.body, it would overwrite the userData object and not keep the same reference to the same object
    Object.assign(userData, req.body);// Store user data
    res.redirect('/job-description'); // Redirect to job description page
});

app.get('/job-description', (req, res) => {
    res.sendFile(__dirname + '/public/job-description.html');
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
