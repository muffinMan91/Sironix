
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const openai = require('../services/openaiClient');


//store the format of the cover letter
const coverLetterFormat = `Paragraph 1: Introduction
"Dear [Company Name], I am [Your Name], a seasoned professional in [your field of expertise], applying for the [Job Title] position. With a rich background in [industry/field], and [X years of experience], I am eager to bring my proven track record of success to your esteemed company."

Paragraph 2: Professional Ambition and Aspiration
"My career has been driven by a passion for [key element related to the job/industry]. In my previous role at [Previous Company Name], I [description of a key accomplishment, e.g., increased productivity by 20%]. This achievement was not only a testament to my skills and dedication but also fueled my desire to take on more significant challenges and make an impactful contribution."

Paragraph 3: Alignment with the Company and Position
"Joining [Company Name] represents an exciting opportunity for personal and professional growth. I am particularly drawn to your commitment to [mention a value, project, innovation of the company]. I believe my experience in [key skill/experience] aligns perfectly with your needs for the [Job Title] role, and I am eager to contribute to [specific goal of the company, e.g., enhancing operational efficiency, increasing customer satisfaction]."

Paragraph 4: Conclusion and Call to Action
"In conclusion, I am eager to bring my [mention a key skill or experience] to [Company Name], actively contributing to [mention a specific area/project/goal]. I am confident that my passion, skills, and dedication would be a valuable addition to your esteemed team. I look forward to discussing in detail how I can contribute to [Company Name]."

Paragraph 5: Appreciation
"Thank you for considering my application. I am looking forward to the opportunity for an interview to discuss further how my experience, skills, and commitment can contribute to the continued success of [Company Name]. You can reach me at [phone number] or [email address]."
`;


//store the requirements of the cover letter
const coverLetterRequirements = `1. Research and Preparation
Company and Industry: Conduct an in-depth analysis of the company, its culture, values, and industry.
Job Role: Understand the job requirements and identify key skills needed.
2. Customization
Adaptation: Tailor your letter for each specific company and job role, avoiding generic templates.
Addressing: Whenever possible, address the letter to a specific individual within the company.
3. Introduction
Expression of Interest: Start by expressing your interest and reasoning for wanting to join the company.
Clarity: Be clear on the specific job role you are applying for.
4. Body of the Letter
Experience and Education: Highlight your educational and professional journey, aligning your skills and experiences with job requirements.
Achievements: Include specific, quantifiable achievements (as in the given example - working for renowned companies, managing complex projects, etc.).
Skills: Ensure to showcase relevant skills and explain how they add value to the company.
5. Company Alignment
Cultural Fit: Emphasize how your values and character align with the company's culture.
Company Knowledge: Demonstrate that you have researched the company and understand its needs and challenges.
6. Conclusion
Reiteration: Reiterate your interest in the role and the company.
Call to Action: State your availability for an interview and eagerness to discuss further your suitability for the role.`;




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
        - Educational Background and Certifications: ${userData.education}
        - Additional Courses/Training: ${userData['additional-courses']}
        - Technical Skills: ${userData['other/additional-skills']}
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


        //generate the cover letter
        const websiteCoverLetterCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `generate a personalized cover letter for this job description: ${jobDescription}... 
            here is the description of the client: ${userInfo}... and here is the coverLetterRequirements: ${coverLetterRequirements}... 
            and here is the coverLetterFormat. do not follow the format exactly as it is only a general outline. try to be creative in your coverletter: ${coverLetterFormat}...
            make sure to include keywords from the job description into the resume if they are aligned with the client's experience. make the cover letter around 240-400 words. 
            do not put too much "fluff" in the cover letter. make it concise and to the point. make sure that skills and experience are aligned with the job description while at the 
            same time making sure that the applicant actually has the skills and experience.do not include text that is related to the job description but not the user's profile. for example, saying that 
            the user is a "software engineer" when they are not a software engineer. or saying that they are a liscenced professional in a certain field when they are not. you can verify this type of information by looking at the user's profile.`

            }],
            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        let websiteCoverLetter = websiteCoverLetterCompletion.choices[0].message.content;


        console.log("cover letter generated");
        if (websiteCoverLetter) {
            res.send(websiteCoverLetter);
        } else {
            res.status(404).send('Generated content not found');
        }


    });




    return router;

}
