
const express = require('express');
const { isLoggedIn } = require('../../utils/middleware.js')
const fs = require('fs');
const path = require('path');
const openai = require('../../services/openaiClient.js');
const PersonalWebsite = require('../../../models/GPTWebsite.js');
const wrapAsync = require('../routeErrors/wrapAsync.js');
const AppError = require('../routeErrors/AppError.js');

const router = express.Router();

router.post('/generateWebsiteAPI', wrapAsync(async (req, res) => {
    //get the html of the user profile page
    let generatedWebsite = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'public', 'userProfile.html'), 'utf8');

    //extract the info from the api request
    const { fullName, title, subtitle, schoolSummary, schoolDetails, experiences, contact } = req.body;

    if (!fullName || !title || !subtitle || !schoolSummary || !schoolDetails || !experiences || !contact) {
        return res.status(400).send('Bad Request: Missing required fields.');
    }



    for (const experience of experiences) {
        if (!experience.name || !experience.description) {
            return res.status(400).send('Bad Request: Missing required experience fields.');
        }
    }

    if (!contact || !contact.email) {
        return res.status(400).send('Bad Request: Missing required contact fields.');
    }


    //generate a random 5 digit number
    const uniqueId = Math.floor(10000 + Math.random() * 90000);
    //remove spaces from the display name
    const uniquePath = `${fullName.replace(/ /g, '')}-${uniqueId}`


    //check if an email is already associated with a personal website
    const personalWebsiteExists = await PersonalWebsite.findOne({ email: email });
    if (personalWebsiteExists) {
        //call a function to replace the placeholders in the html with the user's info
        generatedWebsite = generatedWebsite.replace('<!-- title -->', websiteTitle);
        generatedWebsite = generatedWebsite.replace('<!-- subtitle -->', subtitle);
        generatedWebsite = generatedWebsite.replace('<!-- schoolSummary -->', schoolSummary);
        generatedWebsite = generatedWebsite.replace('<!-- schoolDetails -->', schoolDetails);

        //if it already exists, then update the htmlContent and imageURL
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: generatedWebsite
        });
    } else {
        //replace the generatedWebsite's title with the websiteTitle
        generatedWebsite = generatedWebsite.replace('<!-- title -->', websiteTitle);
        //since the website didn't exist, then create a new item in the PersonalWebsite collection
        const personalWebsite = new GPTWebsite({
            email: email,
            uniquePath: uniquePath,
            htmlContent: generatedWebsite,
            imageURL: ""
        });
        await personalWebsite.save();
    }


    res.status(200).send(websiteLink);
}));
