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
                    <br />
                    <span class="p">Industry Experience</span>
                    <br />
                    <span class="p">Personal Branding</span>
                </h1>
                Based on the user's profile information: ${userInfo}... create a concise HTML header section that captures their unique professional identity and expertise.
                The 3 titles that you choose must be related to the job description and the user's profile. here is the job description: ${jobDescription}... do not include text that is related to the job description but not the user's profile. for example, saying that 
                the user is a "software engineer" when they are not a software engineer. or saying that they are a liscenced professional in a certain field when they are not. you can verify this type of information by looking at the user's profile.`
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
                 job application and reflect the user's enthusiasm and suitability for the position.  the one-liner should be related to the job description and include the company and job they are applying to.  ...example of a one liner could be: "Passionate community development coordinator with a proven track record of networking with public officials and advocating for social justice. Excited to bring my expertise in fundraising and strategic planning to contribute to Helping Hands Foundation."...
                 do not include text that is related to the job description but not the user's profile. for example, saying that 
                 the user is a "software engineer" when they are not a software engineer. or saying that they are a liscenced professional in a certain field when they are not. you can verify this type of information by looking at the user's profile. Here are the details:

                - Job Description: ${jobDescription}...
                - User's personal information:  ${userInfo}...
               

                The one-liner should be formatted as an HTML paragraph (<p>) with id="text04" and class="style1". It should address the hiring manager and express the user's interest in the job, 
                incorporating elements from the job description and the user's profile. Example format: <p id="text04" class="style1">[Generated content here]</p>.
                remember to cross reference the html you are generating and the user profile to make sure that the information is accurate.
               `

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
                role: "system", content: `Create a detailed and engaging paragraph for a personal profile website, highlighting the user's educational achievements and current studies. The content should be suitable for an HTML paragraph with a <span> tag and reflect the user's academic journey. The short paragraph should only be about school and direct and straight to the point. do not 
                include any details about professional experience or anything unrelated to school. Here are the details:

                - User's personal information: ${userInfo}...

                Format the output as an HTML paragraph with id="text09" and class="style1", using <span> tags to encapsulate the information. It should convey the user's academic credentials and aspirations, similar to the following format:
                <p id="text09" class="style1">
                    <span class="p">
                        [Generated content here]
                    </span>
                </p>.
                ... here is an example template of the html that should be generated:  <p id="text09" class="style1">
                <span class="p">
                    I am preparing a Double Degree at EFAP &amp; Essca Shanghai (2025).
                    <br />
                    An MBA specialized in digital marketing, by EFAP &amp; Essca Shanghai
                    <br />
                    A Master of Science in EU-Asia Digital Marketing and Business, by ESSCA
                </span>
            </p> ...not that this is only an example and the content should be different. the degrees that the applicant is pursuing will most likely be different.
             the point of the example is to show how the length of the paragraph is around 3-4 sentences, and should relate to the job description and the user's profile. follow the html format closely. here is the job description that you should try to relate it to: ${jobDescription}...
             do not include text that is related to the job description but not the user's profile. for example, saying that 
                the user is a "software engineer" when they are not a software engineer. or saying that they are a liscenced professional in a certain field when they are not. you can verify this type of information by looking at the user's profile.`
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
                role: "system", content: `Create a paragraph that precisely matches the style, structure, and formatting of the given HTML template example, while varying the content to suit the user's profile. The output should maintain the same use of <div>, <p>, and <span> elements, including classes and IDs, but the text within these tags should reflect the user's educational background. here is the personal information
                about the applicant:  ${userInfo}... Here is the template to emulate:

               
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
                </div>...

               

                here is an example of another user's school section of their website. this is what the structure of the html should look like:
                <div id="container03" class="style1 container default full">
                <div class="wrapper">
                    <div class="inner">
                        <p id="text03" class="style5">I am pursuing a Double Degree - Digital Marketing &amp;
                            Business at EFAP &amp; Essca Shanghai (2025).</p>
                        <div id="image01" class="image">
                            <span class="frame deferred">
                                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAxOTgwIDEzMjAiIHdpZHRoPSIxOTgwIiBoZWlnaHQ9IjEzMjAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyZWN0IGZpbGw9IiMyYjJmMmMiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4%3D"
                                    data-src="assets/images/image01.jpg?v=7b2de9de" alt="" />
                            </span>
                        </div>
                        <p id="text05" class="style5">
                            <span class="p">An active pedagogy... ✍🏽</span>
                            <span class="p">&quot;Since its creation in 1961, EFAP remains the first school of
                                communication training the best communicators in France, creative and daring,
                                adapted to a world in perpetual movement.&quot;</span>
                            <span class="p">My courses at EFAP are composed of :</span>
                            <span class="p">
                                - Event Management
                                <br />
                                - Art Oratoire
                                <br />
                                - Video editing
                                <br />
                                - Marketing
                                <br />
                                - Personal Branding
                                <br />
                                - Digital Marketing
                            </span>
                            <span class="p">By adapting them to all sectors of activity: luxury, industry,
                                health...</span>
                        </p>
                    </div>
                </div>
            </div> ...

                The generated content should follow the template's format closely, using the same tags and classes,
                 but with content tailored to the user's specific educational experiences. This means that the content within the tags will be different for the user you are generating content for. The html above is only an example that shows
                  the general structure of the html tags. Ensure the tone is engaging and the content is informative,
                  fitting seamlessly into the provided template style. If the courses the user has taken can not be found, then generate ones that you think the user has taken instead of just copying the ones
                  from the html template example. for the images, use this src: https://picsum.photos/200. Also, only mention that they are "currently studying" if they are still in school which can be checked by the date of they degree.
                  this section should relate to the job description and the user's profile. here is the job description: ${jobDescription}...remember to cross reference the html you are generating and the user profile to make sure that the information is accurate.`
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

                ... here is an example of the html that should be generated:
                <h2 id="text02" class="style4">My Experiences</h2>
                <p id="text14" class="style7">I have selected 3 experiences, related to the internship
                    offer, I let you discover them.</p>
                <ul id="links04" class="style2 links">
                    <li class="n01">
                        <a href="#experience1">La Folie Douce</a>
                    </li>
                </ul>
                <ul id="links05" class="style2 links">
                    <li class="n01">
                        <a href="#experience2">Théra</a>
                    </li>
                </ul>
                <ul id="links03" class="style2 links">
                    <li class="n01">
                        <a href="#experience3">Porsche Clubs France</a>
                    </li>
                </ul> ... follow the html format exactly as it is shown in the example. the only thing that should change is the text in the <a> tags.

                The output should reflect the user's professional journey as described in 'userInfo', with the HTML formatting and styling exactly as shown in the example. Ensure that each experience is presented in its own <ul> for clarity and visual consistency with the provided template. for the images, use this src: https://picsum.photos/200
                this section should relate to the job description and the user's profile. here is the job description: ${jobDescription}...do not include text that is related to the job description but not the user's profile. for example, saying that 
                the user is a "software engineer" when they are not a software engineer. or saying that they are a liscenced professional in a certain field when they are not. you can verify this type of information by looking at the user's profile.`
            }],

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
                    </div>...

                    here is an example of the html that should be generated:
                    <div id="container04" class="style1 container default full">
                        <div class="wrapper">
                            <div class="inner">
                                <p id="text07" class="style5">
                                    <span class="p">La Folie Douce is a festive establishment located in various French
                                        winter sports resorts (Courchevel, Val d&#39;Isère, Megève, Val Thorens),</span>
                                    <span class="p">
                                        I did an internship at
                                        <strong>La Folie Douce</strong>
                                        I was in charge of several key missions.
                                        <br />
                                        First of all, I managed the social media activity of La Folie Douce Les Arcs,
                                        which involved creating and posting engaging content on a regular basis to keep
                                        our audience engaged. I also managed the company&#39;s web activity by working
                                        on SEO to improve the visibility of our website.
                                    </span>
                                    <span class="p">Then, I created digital communication campaigns to promote the
                                        events organized by La Folie Douce Les Arcs, and I managed the paid advertising
                                        campaigns to reach a wider audience. To support my communication campaigns, I
                                        also created graphics and videos for different events.</span>
                                    <span class="p">Finally, I was in charge of creating and ensuring the smooth running
                                        of exceptional events for La Folie Douce. This involved working closely with
                                        different partners and suppliers to ensure the quality of the experience offered
                                        to our customers. During this internship, I gained many valuable skills in
                                        digital marketing, content creation and event management.</span>
                                </p>
                                <div id="image02" class="image">
                                    <span class="frame deferred">
                                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAxOTgwIDE0ODUiIHdpZHRoPSIxOTgwIiBoZWlnaHQ9IjE0ODUiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyZWN0IGZpbGw9IiMzMTE4MWUiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4%3D"
                                            data-src="assets/images/image02.jpg?v=7b2de9de" alt="" />
                                    </span>
                                </div>
                                <div id="image04" class="image">
                                    <span class="frame deferred">
                                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAxOTgwIDEwNDMiIHdpZHRoPSIxOTgwIiBoZWlnaHQ9IjEwNDMiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxyZWN0IGZpbGw9IiM1NjQzNGYiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4%3D"
                                            data-src="assets/images/image04.jpg?v=7b2de9de" alt="" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div> ...
                
                - Content Requirements:
                    1. The description should relate back to the role and company of the first experience listed in 'websiteExperiences':  ${websiteExperiences}...
                    2. Highlight key responsibilities, projects, and the impact made during this experience.
                    3. Include insights or skills gained, emphasizing how this experience is relevant to the user's professional growth.
                
                
               
                - User's personal information can be used to learn more about the user's experiences: ${userInfo}...
                
                Ensure the output is tailored to reflect the specifics of the first experience in 'websiteExperiences', adhering to the style and structure of the HTML example provided. The content should be detailed, reflective of the user's role and contributions, and formatted with multiple <span> tags within the <p> tag, as shown in the template. for the images, use this src: https://picsum.photos/200 ... this section should relate to the job description and the user's profile. here is the job description: ${jobDescription}...
                do not include text that is related to the job description but not the user's profile. for example, saying that 
                the user is a "software engineer" when they are not a software engineer. or saying that they are a liscenced professional in a certain field when they are not. you can verify this type of information by looking at the user's profile.`
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
                    </div>...

                    here is an example of the html that should be generated:
                    <p id="text10" class="style1">
                    <span class="p">
                        During my 2022-2023 internship at
                        <strong>Théra</strong>
                        , a subsidiary of
                        <strong>Institut Mérieux</strong>
                        , we carried out all the bioMérieux events, but we also opened up to different international
                        markets.
                    </span>
                    <span class="p">First, I worked on the organization of two B2B trade shows: &quot;Rendez-Vous en
                        France&quot; and &quot;Destination Montagnes&quot;. My role was to assist the team in
                        setting up the different stands, welcoming visitors and managing the different logistical
                        aspects so that the shows could take place in the best possible conditions.</span>
                    <span class="p">
                        Then, I participated in the preparation of the launch of new products for bioMérieux, a
                        company of the group. It was a major event with the presence of several hundred internal
                        employees.
                        <br />
                        I worked on different aspects of the event, from internal communication to the management of
                        invitations and the setting up of the product presentation area.
                    </span>
                    <span class="p">Finally, I was involved in the creation and implementation of an anniversary
                        event for bioMérieux. This project allowed me to participate in different steps, from the
                        conception of the event to the logistic management on the day. I also had the opportunity to
                        work closely with the various service providers and stakeholders to ensure the success of
                        the event.</span>
                    <span class="p">During this internship, I acquired many skills in event organization, project
                        management and internal and external communication. I also learned to work in a team in a
                        stimulating and rewarding professional environment.</span>
                </p>
                <div id="image03" class="image">
                    <span class="frame deferred">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjAiIHk9IjAiIHZpZXdCb3g9IjAgMCAxMjMyIDYxNiIgd2lkdGg9IjEyMzIiIGhlaWdodD0iNjE2IiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIj48cmVjdCBmaWxsPSIjNDc0ZjY1IiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8%2BPC9zdmc%2B"
                            data-src="assets/images/image03.jpg?v=7b2de9de" alt="" />
                    </span>
                </div> ...
                
                - Content Requirements:
                    1. The description should be specific to the role and company of the second experience listed in 'websiteExperiences'.
                    2. Highlight key responsibilities, projects, and the impact made during this experience.
                    3. Include insights or skills gained, emphasizing how this experience is relevant to the user's professional growth.
                
                User Profile Overview (websiteExperiences variable):
                ${websiteExperiences}...
                - User's personal information: ${userInfo}...
                
                Ensure the output is tailored to reflect the specifics of the second experience in 'websiteExperiences', adhering to the style and structure of the HTML example provided. The content should be detailed, reflective of the user's role and contributions, and formatted with multiple <span> tags within the <p> tag, as shown in the template. for the images, use this src: https://picsum.photos/200 ... this section should relate to the job description and the user's profile. here is the job description: ${jobDescription}...
                do not include text that is related to the job description but not the user's profile. for example, saying that 
                the user is a "software engineer" when they are not a software engineer. or saying that they are a liscenced professional in a certain field when they are not. you can verify this type of information by looking at the user's profile.`
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
                    </div>...

                    here is an example of the html that should be generated:
                    <p id="text13" class="style1">
                        <span class="p">Porsche, Porsche, Porsche...</span>
                        <span class="p">
                            For more than 5 years, I have been an active volunteer in the Federation of Porsche Clubs of
                            France.
                            <br />
                            Besides the fact that these are exceptional cars, I have learned a lot within the Porsche
                            community.
                        </span>
                        <span class="p">
                            <strong>Welcome to the story of one of my greatest passions: Porsche and the automotive
                                industry</strong>
                        </span>
                        <span class="p">First of all, my network.</span>
                        <span class="p">
                            Being bilingual, I was able to talk to some very inspiring people of all nationalities.
                            <br />
                            As the son of the president of the Porsche Clubs of France, I can tell you that I was almost
                            born in a Porsche Club.
                        </span>
                        <span class="p">The discussions with people started around a common passion and often led to
                            advice and rich exchanges.</span>
                        <span class="p">
                            My personality really matured thanks to the encounters I made during the events.
                            <br />
                            <strong>My desire to be an entrepreneur</strong>
                        </span>
                        <span class="p">
                            Having been a volunteer at the Le Mans Classic, or the Porsche Spring Meeting.
                            <br />
                            I was able to assist in the preparation and realization of an international event.
                        </span>
                        <span class="p">Organizing the parking, about 8500 cars on the event or preparing 2000 Welcome
                            Pack... that was my job!</span>
                        <span class="p">
                            Those weekends were full of work.
                            <br />
                            Getting up earlier than everyone else and staying up later.
                        </span>
                        <span class="p">
                            It was hard work, but the happiness was total.
                            <br />
                            I developed a real taste for a job well done.
                        </span>
                    </p> ...
                
                - Content Requirements:
                    1. The description should be specific to the role and company of the third experience listed in 'websiteExperiences'.
                    2. Highlight key responsibilities, projects, and the impact made during this experience.
                    3. Include insights or skills gained, emphasizing how this experience is relevant to the user's professional growth.
                
                User Profile Overview (websiteExperiences variable):
                ${websiteExperiences}...
                - User's personal information: ${userInfo}...
                
                Ensure the output is tailored to reflect the specifics of the third experience in 'websiteExperiences', adhering to the style and structure of the HTML example provided. The content should be detailed, reflective of the user's role and contributions, and formatted with multiple <span> tags within the <p> tag, as shown in the template. this section should relate to the job description and the user's profile. here is the job description: ${jobDescription}...
                do not include text that is related to the job description but not the user's profile. for example, saying that 
                the user is a "software engineer" when they are not a software engineer. or saying that they are a liscenced professional in a certain field when they are not. you can verify this type of information by looking at the user's profile.`
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
