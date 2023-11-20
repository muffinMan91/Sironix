// In generateWebsite.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const openai = require('../services/openaiClient');

//read the html template as plain text and store it in websiteTemplate
let websiteTemplate = fs.readFileSync(path.join(__dirname, '..', 'public', 'userProfile.html'), 'utf8');

module.exports = function (userData) {




    const router = express.Router();



    router.get('/generate-website', async (req, res) => {

        console.log("generating website");


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

        console.log("attempting to generate html");

        //generate the website title
        const websiteTitleCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `You are an AI assistant tasked with generating a brief and versatile HTML section for a user's personal profile website, 
                based on the detailed information provided. The output should be concise, containing only three lines of HTML, and should mirror the style and format 
                of the provided template. The content should be tailored to highlight the user's specific professional expertise and background. Use the following 
                template as a stylistic guide:
                <h1 id="text01" class="style2">
                    <span class="p">Professional Expertise</span>
                    <span class="p">Industry Experience</span>
                    <span class="p">Personal Branding</span>
                </h1>
                Based on the user's profile information: ${userInfo}, create a concise HTML header section that captures their unique professional identity and expertise.`
            }],
            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        let websiteTitle = websiteTitleCompletion.choices[0].message.content;

        console.log('websiteTitle: ', websiteTitle);


        //generate the sub-title of the website
        const websiteSubTitleCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `Create a professional and engaging one-liner for a personal profile website's subtitle. The one-liner should be suited for a
                 job application and reflect the user's enthusiasm and suitability for the position. the one-liner should be related to the job description. Here are the details:

                - Job Description: "${jobDescription.text}"
                - User's personal information:  ${userInfo}...
               

                The one-liner should be formatted as an HTML paragraph (<p>) with id="text04" and class="style1". It should address the hiring manager and express the user's interest in the job, 
                incorporating elements from the job description and the user's profile. Example format: <p id="text04" class="style1">[Generated content here]</p>.`
            }],
            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        let websiteSubTitle = websiteSubTitleCompletion.choices[0].message.content;

        console.log('websiteSubTitle: ', websiteSubTitle);


        //generate the sub-title of the website
        const websiteSchoolSummaryCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `Create a detailed and engaging paragraph for a personal profile website, highlighting the user's educational achievements and current studies. The content should be suitable for an HTML paragraph with a <span> tag and reflect the user's academic journey. Here are the details:

                - User's personal information: ${userInfo}...

                Format the output as an HTML paragraph with id="text09" and class="style1", using <span> tags to encapsulate the information. It should convey the user's academic credentials and aspirations, similar to the following format:
                <p id="text09" class="style1">
                    <span class="p">
                        [Generated content here]
                    </span>
                </p>.`
            }],
            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        let websiteSchoolSummary = websiteSchoolSummaryCompletion.choices[0].message.content;

        console.log('websiteSchoolSummary: ', websiteSchoolSummary);

        const websiteSchoolDetailsCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `Create a paragraph that precisely matches the style, structure, and formatting of the given HTML template example, while varying the content to suit the user's profile. The output should maintain the same use of <div>, <p>, and <span> elements, including classes and IDs, but the text within these tags should reflect the user's educational and professional background. Here is the template to emulate:

                HTML Template Example:
                <div id="container03" class="style1 container default full">
                    <div class="wrapper">
                        <div class="inner">
                            <p id="text03" class="style5">[Brief description of current study or significant educational pursuit]</p>
                            <div id="image01" class="image">
                                <span class="frame deferred">
                                    <img src="[Placeholder for image URL]" alt="[Placeholder for image alt text]" />
                                </span>
                            </div>
                            <p id="text05" class="style5">
                                <span class="p">[Short engaging statement or quote]</span>
                                <span class="p">[Informative statement about the institution or program]</span>
                                <span class="p">My courses at [Institution] are composed of :</span>
                                <span class="p">
                                    - [List of key courses or subjects]
                                </span>
                                <span class="p">[Statement on how these courses apply to various sectors]</span>
                            </p>
                        </div>
                    </div>
                </div>

                - User's personal information: ${userInfo}...

                The generated content should follow the template's format closely, using the same tags and classes,
                 but with content tailored to the user's specific educational and professional experiences. Ensure the tone is engaging and the content is informative,
                  fitting seamlessly into the provided template style. for the images, use this src: https://picsum.photos/200`
            }],
            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        let websiteSchoolDetails = websiteSchoolDetailsCompletion.choices[0].message.content;

        console.log('websiteSchoolDetails: ', websiteSchoolDetails);


        const websiteExperiencesCompletion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `Create content for the 'My Experiences' section on a personal profile website, focusing on three significant professional experiences. The output should closely follow the structure and styling of the provided HTML example, including separate <ul> elements for each experience. Here are the details:

                - Section Title: <h2 id="text02" class="style4">My Experiences</h2>
                - One-Liner Introduction: Write a concise, one-sentence introduction in a <p> tag with id="text14" and class="style7".
                - Experience List: Generate three separate <ul> elements, each with a unique ID and class="style2 links". Within each <ul>, include one <li> item with class="n01" and an <a> tag linking to the detailed experience.

                Specific Structure and IDs for Each Experience:
                1. <ul id="links04" class="style2 links"><li class="n01"><a href="#experience1">[First Experience Title]</a></li></ul>
                2. <ul id="links05" class="style2 links"><li class="n01"><a href="#experience2">[Second Experience Title]</a></li></ul>
                3. <ul id="links03" class="style2 links"><li class="n01"><a href="#experience3">[Third Experience Title]</a></li></ul>

                - User's personal information: ${userInfo}...

                The output should reflect the user's professional journey as described in 'userInfo', with the HTML formatting and styling exactly as shown in the example. Ensure that each experience is presented in its own <ul> for clarity and visual consistency with the provided template. for the images, use this src: https://picsum.photos/200`}],

            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        let websiteExperiences = websiteExperiencesCompletion.choices[0].message.content;

        console.log('websiteExperiences: ', websiteExperiences);






        const websiteExperience1Completion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `Generate a detailed description for the first professional experience listed in the 'websiteExperiences' variable. The content should match the format of the provided HTML template and be as engaging and informative as the example. Here are the specifics:

                - Experience Title: Extracted from the first list item in 'websiteExperiences'.
                - Format to Follow:
                    <div id="container04" class="style1 container">
                        <div class="wrapper">
                            <div class="inner">
                                <p id="text07" class="style5">
                                    <span class="p">[Detailed description of the experience, similar to the example]</span>
                                    <span class="p">[Further details about responsibilities, projects, and achievements]</span>
                                    <span class="p">[Additional insights or skills gained during this experience]</span>
                                </p>
                                <!-- Image placeholders -->
                                <div id="image02" class="image"><span class="frame deferred"><img src="data:image/svg+xml;base64,[Base64 Image Placeholder]" alt="" /></span></div>
                                <div id="image04" class="image"><span class="frame deferred"><img src="data:image/svg+xml;base64,[Base64 Image Placeholder]" alt="" /></span></div>
                            </div>
                        </div>
                    </div>
                
                - Content Requirements:
                    1. The description should be specific to the role and company of the first experience listed in 'websiteExperiences'.
                    2. Highlight key responsibilities, projects, and the impact made during this experience.
                    3. Include insights or skills gained, emphasizing how this experience is relevant to the user's professional growth.
                
                User Profile Overview (websiteExperiences variable):
                ${websiteExperiences}...
                - User's personal information: ${userInfo}...
                
                Ensure the output is tailored to reflect the specifics of the first experience in 'websiteExperiences', adhering to the style and structure of the HTML example provided. The content should be detailed, reflective of the user's role and contributions, and formatted with multiple <span> tags within the <p> tag, as shown in the template. for the images, use this src: https://picsum.photos/200`
            }],

            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        let websiteExperience1 = websiteExperience1Completion.choices[0].message.content;

        console.log('websiteExperience1: ', websiteExperience1);



        const websiteExperience2Completion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `Generate a detailed description for the second professional experience listed in the 'websiteExperiences' variable. The content should match the format of the provided HTML template and be as engaging and informative as the example. Here are the specifics:

                - Experience Title: Extracted from the second list item in 'websiteExperiences'.
                - Format to Follow:
                    <div id="container04" class="style1 container">
                        <div class="wrapper">
                            <div class="inner">
                                <p id="text07" class="style5">
                                    <span class="p">[Detailed description of the experience, similar to the example]</span>
                                    <span class="p">[Further details about responsibilities, projects, and achievements]</span>
                                    <span class="p">[Additional insights or skills gained during this experience]</span>
                                </p>
                                <!-- Image placeholders -->
                                <div id="image02" class="image"><span class="frame deferred"><img src="data:image/svg+xml;base64,[Base64 Image Placeholder]" alt="" /></span></div>
                                <div id="image04" class="image"><span class="frame deferred"><img src="data:image/svg+xml;base64,[Base64 Image Placeholder]" alt="" /></span></div>
                            </div>
                        </div>
                    </div>
                
                - Content Requirements:
                    1. The description should be specific to the role and company of the second experience listed in 'websiteExperiences'.
                    2. Highlight key responsibilities, projects, and the impact made during this experience.
                    3. Include insights or skills gained, emphasizing how this experience is relevant to the user's professional growth.
                
                User Profile Overview (websiteExperiences variable):
                ${websiteExperiences}...
                - User's personal information: ${userInfo}...
                
                Ensure the output is tailored to reflect the specifics of the second experience in 'websiteExperiences', adhering to the style and structure of the HTML example provided. The content should be detailed, reflective of the user's role and contributions, and formatted with multiple <span> tags within the <p> tag, as shown in the template. for the images, use this src: https://picsum.photos/200`
            }],

            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        let websiteExperience2 = websiteExperience2Completion.choices[0].message.content;

        console.log('websiteExperience2: ', websiteExperience2);






        const websiteExperience3Completion = await openai.chat.completions.create({
            messages: [{
                role: "system", content: `Generate a detailed description for the third professional experience listed in the 'websiteExperiences' variable. The content should match the format of the provided HTML template and be as engaging and informative as the example. Here are the specifics:

                - Experience Title: Extracted from the third list item in 'websiteExperiences'.
                - Format to Follow:
                    <div id="container04" class="style1 container">
                        <div class="wrapper">
                            <div class="inner">
                                <p id="text07" class="style5">
                                    <span class="p">[Detailed description of the experience, similar to the example]</span>
                                    <span class="p">[Further details about responsibilities, projects, and achievements]</span>
                                    <span class="p">[Additional insights or skills gained during this experience]</span>
                                </p>
                                <!-- Image placeholders -->
                                <div id="image02" class="image"><span class="frame deferred"><img src="data:image/svg+xml;base64,[Base64 Image Placeholder]" alt="" /></span></div>
                                <div id="image04" class="image"><span class="frame deferred"><img src="data:image/svg+xml;base64,[Base64 Image Placeholder]" alt="" /></span></div>
                            </div>
                        </div>
                    </div>
                
                - Content Requirements:
                    1. The description should be specific to the role and company of the third experience listed in 'websiteExperiences'.
                    2. Highlight key responsibilities, projects, and the impact made during this experience.
                    3. Include insights or skills gained, emphasizing how this experience is relevant to the user's professional growth.
                
                User Profile Overview (websiteExperiences variable):
                ${websiteExperiences}...
                - User's personal information: ${userInfo}...
                
                Ensure the output is tailored to reflect the specifics of the third experience in 'websiteExperiences', adhering to the style and structure of the HTML example provided. The content should be detailed, reflective of the user's role and contributions, and formatted with multiple <span> tags within the <p> tag, as shown in the template.`
            }],

            //todo: try to limit amount of responses
            n: 1,
            temperature: 0.1,
            model: "gpt-3.5-turbo",
        });
        let websiteExperience3 = websiteExperience3Completion.choices[0].message.content;

        console.log('websiteExperience3: ', websiteExperience3);









        // //insert the ai content into the html template
        websiteTemplate = websiteTemplate.replace('<!-- title -->', websiteTitle);
        websiteTemplate = websiteTemplate.replace('<!-- sub title -->', websiteSubTitle);
        websiteTemplate = websiteTemplate.replace('<!-- school summary -->', websiteSchoolSummary);
        websiteTemplate = websiteTemplate.replace('<!-- school details -->', websiteSchoolDetails);
        websiteTemplate = websiteTemplate.replace('<!-- experiences -->', websiteExperiences);
        websiteTemplate = websiteTemplate.replace('<!-- experience1 -->', websiteExperience1);
        websiteTemplate = websiteTemplate.replace('<!-- experience2 -->', websiteExperience2);
        websiteTemplate = websiteTemplate.replace('<!-- experience3 -->', websiteExperience3);
        console.log("website generated");


        //each client will have their own generated website link
        res.json({ url: '/generatedWebsite' });
    });

    //once the user recieves their specific link, they can request the generated website
    router.get('/generatedWebsite', async (req, res) => {
        res.send(websiteTemplate);
    });


    return router;

}
