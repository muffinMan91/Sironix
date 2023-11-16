
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const openai = require('../services/openaiClient');

let generatedCoverLetterContent = 'testing cover';

module.exports = function (userData) {




    const router = express.Router();



    router.get('/generate-coverLetter', async (req, res) => {

        console.log("generating cover letter");

        const jobDescription = req.query.jobDescription;


        let userInfo = `User Profile Overview: 
        - Full Name: ${userData['full-name']}
        - Date of Birth: ${userData.dob}
        - Email Address: ${userData.email}
        - Phone Number: ${userData.phone}
        - Location: ${userData.location}
        - Nationality: ${userData.nationality}
        - Language Proficiency: ${userData.languages}
        - Current Position: ${userData['current-position']}
        - Professional Experience: ${userData.jobs}
        - Primary Responsibilities: ${userData.responsibilities}
        - Specific Achievements: ${userData.achievements}
        - Skills Acquired: ${userData.skills}
        - Educational Background: ${userData.education} at ${userData.institutions}
        - Additional Courses/Training: ${userData['additional-courses']}
        - Technical Skills: ${userData['tech-skills']}
        - Software and Technology Skills: ${userData['software-skills']}
        - Awards and Recognitions: ${userData.awards}
        - Major Projects and Initiatives: ${userData.projects}
        - Career Goals: Seeking a position as ${userData['position-sought']}, with long-term aspirations in ${userData['long-term-goals']}
        - Industry Preferences: ${userData['industry-preferences']}
        - Volunteer Activities: ${userData.volunteer}
        - Hobbies and Interests: ${userData.hobbies}
        - References: ${userData.references}
        - LinkedIn Profile: ${userData.linkedin}
    `;

        console.log("cover letter generated");
        if (generatedCoverLetterContent) {
            res.send(generatedCoverLetterContent);
        } else {
            res.status(404).send('Generated content not found');
        }


    });




    return router;

}
