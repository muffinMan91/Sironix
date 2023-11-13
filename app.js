const express = require('express');
const openai = require('./services/openaiClient');
const bodyParser = require('body-parser');
const app = express();
let userData = {};
let jobDescription = { text: "" };

const PORT = process.env.PORT || 3000;

const generateWebsiteRoute = require('./routes/generate-website')(userData, jobDescription);

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

// Route to handle form submission
app.post('/submit-form', (req, res) => {
    //if you did userData = req.body, it would overwrite the userData object and not keep the same reference to the same object
    Object.assign(userData, req.body);// Store user data
    res.redirect('/job-description'); // Redirect to job description page
});

app.get('/job-description', (req, res) => {
    res.sendFile(__dirname + '/public/job-description.html');
});


// generate resume, cover letter, email to HR, and video script for the user
app.post('/generate-materials', (req, res) => {
    jobDescription.text = req.body.jobDescription;
    const generatedContent = "<p>Generated Resume based on " + jobDescription.text + "</p><p>Generated Cover Letter based on user's experience</p>";

    res.json({ content: generatedContent });


});




// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
