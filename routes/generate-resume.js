
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const openai = require('../services/openaiClient');


let generatedResumeContent = '';
let htmlTemplate = fs.readFileSync(path.join(__dirname, '..', 'public', 'resumeTemplate.html'), 'utf8');

module.exports = function (userData) {

    //read the html template as plain text and store it in htmlTemplate



    const router = express.Router();



    router.get('/generate-resume', async (req, res) => {

        console.log("generating resume");

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

        let resumeHTML = `
    <body>
        <div class="container mt-5">
            <div class="resume">
                <header class="text-center mb-4">
                    <h1 id="name"></h1>
                    <small id="title" class="text-muted"></small>
                </header>
                <div class="row mb-3">
                    <div class="col-md-4 text-center">
                        <p>Email: <span id="email"></span></p>
                    </div>
                    <div class="col-md-4 text-center">
                        <p>Phone: <span id="phone"></span></p>
                    </div>
                    <div class="col-md-4 text-center">
                        <p>LinkedIn: <span id="linkedin"></span></p>
                    </div>
                </div>
                <section class="mb-4">
                    <h2 class="h4">Professional Summary</h2>
                    <p id="professional-summary"></p>
                </section>
                <section class="mb-4">
                    <h2 class="h4">Skills</h2>
                    <ul id="skills-list" class="list-unstyled">
                        <!-- Skills will go here. add more if needed -->
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </section>
                <section class="mb-4">
                    <h2 class="h4">Experience</h2>
                    <ul id="experience-list" class="list-unstyled">
                        <!-- Experience items will go here. add more if needed -->
                        <li></li>
                        <li></li>
                    </ul>
                </section>
                <section class="mb-4">
                    <h2 class="h4">Education</h2>
                    <ul id="education-list" class="list-unstyled">
                        <!-- Education items will go here. add more if needed -->
                        <li></li>
                    </ul>
                </section>
                <!-- Additional sections like Projects, Certifications, Languages can be added here -->
            </div>
        </div>
        <!-- Bootstrap JS, Popper.js, and jQuery -->
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    </body>`;

        //generate the resume
        const websiteResumeCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `I have HTML for a resume. here is the html: ${resumeHTML}. 
                  ... here is the applicant's information: ${userInfo}.
                  Could you please help me fill in the resumeHTML with the data from userInfo? Specifically, 
                  replace placeholders in the HTML with values from the information of the applicant.
                  as you are doing that, make sure to align the resume with the job description while also making sure your inputs are relavent to the applicant: ${jobDescription}...
                  make sure not to put info into the resume that aligns with the job description but is not relavent to the applicant. do not change the structure of the 
                  resume in the html. just fill in the placeholders.`

            }],
            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        generatedResumeContent = websiteResumeCompletion.choices[0].message.content;


        console.log("resume html generated:", generatedResumeContent);

        htmlTemplate = htmlTemplate.replace('<!-- resume template -->', generatedResumeContent);

        //each client will have their own generated website link
        res.json({ url: '/generatedResume' });


    });

    //once the user recieves their specific link, they can request the generated website
    router.get('/generatedResume', async (req, res) => {
        res.send(htmlTemplate);
    });



    return router;

}
