
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const openai = require('../services/openaiClient');



let resumeTemplate = fs.readFileSync(path.join(__dirname, '..', 'public', 'resumeTemplate.html'), 'utf8');

module.exports = function (userData) {


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
        - Educational Background and Certifications: ${userData.education}
        - Additional Courses/Training: ${userData['additional-courses']}
        - Additional Skills: ${userData['other/additional-skills']}
        - Awards and Recognitions: ${userData.awards}
        - Projects or Initiatives Led: ${userData.projects}
        - Position Sought: ${userData['position-sought']}
        - Long-term Professional Aspirations: ${userData['long-term-goals']}
        - Industry/Sector Preferences: ${userData['industry-preferences']}
        - Volunteer Activities: ${userData.volunteer}
        - Hobbies/Interests: ${userData.hobbies}
        - References Contact Details: ${userData.references}
        - LinkedIn Profile: ${userData.linkedin}
        `;




        //generate the resume
        const websiteResumeCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `I have an HTML template for a resume and need to populate it with an applicant's information: ${userInfo}. The HTML of the resume template is as follows: ${resumeTemplate}... make sure to include keywords from the job description into the resume if they are aligned with the client's experience. Here is the job description: ${jobDescription}...
                the upper section of the resume includes this html: 
                " <div class="yui-u first">
                <h1>Jonathan Doe</h1>
                <h2>Web Designer, Director</h2>
            </div>" ... make sure to replace the name and position with the applicant's name and position. the position should be the same as the position sought by the applicant which should be related to the job description.
            for example, if the lawyer is applying to a marketing job, make sure the h2 tag is about marketing and not about law...

                Please update the resume HTML with the applicant's data, ensuring that:
                1. All personal details like name, contact information, and email are correctly replaced, directly substituting the placeholders in the HTML. the position should be the same as the position sought by the applicant which should be related to the job description.
                2. The 'Profile' section reflects the applicant's professional summary or objective, aligning with the job description while staying true to the applicant's actual experience. It should be around 2-3 sentences and be direct and to the point.
                3. The 'Skills' section accurately lists 3 of the most relevant applicant's skills as provided in the userInfo. The title of each of those 3 skills should be 2 words maximum. below those titles, there should be a short description of each skill, around 3-4 sentences.
                4. The 'Technical' section should list the applicant's technical and soft skills and proficiencies. Update the list items to reflect the applicant's actual technical and soft skills, ensuring they align with the job description. do not include any skills that do not apply to the applicant. there should be a max of 6 skills listed.
                5. The 'Experience' section is updated with the applicant's work history, including company names, roles, and dates, ensuring alignment with the job description. below each role, there should be a short description of the applicant's responsibilities and achievements, around 3-4 sentences.
                6. The 'Education' section reflects the applicant's academic background and any certifications. Follow the format of the original template where the university name and location are an h2 and the dates and degree are h3s. For certifications, the name of the certification is in h2 and the date for it is in h3. make sure to always put the location of the univeristy as well.
                7. Any placeholder text not relevant to the applicant is removed or replaced with the applicant's actual information.
                8. The structure and formatting of the resume remain unchanged.
                
                Please pay close attention to ensure that all sections of the resume are updated accurately and no placeholder text from the original template remains unless it directly applies to the applicant. Only generate the HTML, do not output anything after the HTML is generated. Keep in mind that every section that is generated must be closely to the job description.
                do not include text that is related to the job description but not the user's profile. for example, saying that 
                the user is a "software engineer" when they are not a software engineer. or saying that they are a liscenced professional in a certain field when they are not. you can verify this type of information by looking at the user's profile.
                 `

            }],
            temperature: 0.1,
            model: "gpt-4-1106-preview",
        });
        resumeTemplate = websiteResumeCompletion.choices[0].message.content;


        console.log("resume html generated:", resumeTemplate);


        //each client will have their own generated website link
        res.json({ url: '/generatedResume' });


    });

    //once the user recieves their specific link, they can request the generated website
    router.get('/generatedResume', async (req, res) => {
        res.send(resumeTemplate);
    });



    return router;

}
