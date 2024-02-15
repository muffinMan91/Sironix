// In generateWebsite.js
const express = require('express');
const { isLoggedIn } = require('../../utils/middleware.js')
const fs = require('fs');
const path = require('path');
const openai = require('../../services/openaiClient.js');
const PersonalWebsite = require('../../../models/PersonalWebsite.js');
const wrapAsync = require('../routeErrors/wrapAsync.js');
const AppError = require('../routeErrors/AppError.js');


const router = express.Router();

router.post('/generate-Title', isLoggedIn, wrapAsync(async (req, res) => {
    //read the html template as plain text and store it in generatedWebsite 
    let generatedWebsite = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'public', 'userProfile.html'), 'utf8');


    const resumeText = req.body.resumeText;



    //generate the website title
    const websiteTitleCompletion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: `You are an AI assistant tasked with generating a brief title an applicant's personal profile website, 
                based on the detailed information provided. The output should be concise, containing only max of 8 words. The title should be tailored to highlight 2 of the applicant's specific professional expertise and background.

                Here is the applicant's resume: ${resumeText}... 
                create a concise title of the webiste that captures their unique professional identity and expertise. do not surround the title with any quotations. Do not include name of applicant in the title. speak in first person.
                Do not use uncommon words such as "maven" instead of "expert".
                `
        }],
        //todo: try to limit amount of responses
        n: 1,
        temperature: 0.1,
        model: "gpt-4-1106-preview",
    });

    let websiteTitle = websiteTitleCompletion.choices[0].message.content;
    websiteTitle = websiteTitle.replace(/^```html\n?|\n?```$/g, "").trim();
    console.log('websiteTitle: ', websiteTitle);

    //generate a random 5 digit number
    const uniqueId = Math.floor(10000 + Math.random() * 90000);
    //remove spaces from the display name
    const uniquePath = `${req.user.displayName.replace(/ /g, '')}-${uniqueId}`

    //if the req.user.id is already in the PersonalWebsite collection, then update the htmlContent and imageURL
    const personalWebsiteExists = await PersonalWebsite.findOne({ userID: req.user.id });



    if (personalWebsiteExists) {
        //even if it exists, start the website from scratch. generatedWebsite is the original html template
        generatedWebsite = generatedWebsite.replace('<!-- title -->', websiteTitle);
        //if it already exists, then update the htmlContent and imageURL
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: generatedWebsite
        });
    } else {
        //replace the generatedWebsite's title with the websiteTitle
        generatedWebsite = generatedWebsite.replace('<!-- title -->', websiteTitle);
        //since the website didn't exist, then create a new item in the PersonalWebsite collection
        const personalWebsite = new PersonalWebsite({
            userID: req.user.id,
            uniquePath: uniquePath,
            htmlContent: generatedWebsite,
            imageURL: ""
        });
        await personalWebsite.save();
    }

    return res.send("success");
}));



router.post('/generate-subTitle', isLoggedIn, wrapAsync(async (req, res) => {
    const resumeText = req.body.resumeText;
    //generate the sub-title of the website
    const websiteSubTitleCompletion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: `here is the resume of the applicant:  ${resumeText}... Create a professional and engaging one-liner for a personal profile website's subtitle. The one-liner should be suited for a
                 job application and reflect the applicant's enthusiasm.  the one-liner should be related to the applicant's background information and personal experience. 
                 example of a one liner could be: "Passionate community development coordinator with a 
                 proven track record of networking with public officials and advocating for social justice."...




                The one-liner should be formatted as an HTML paragraph (<p>) with id="text06" and class="style5". Example format: <p id="text06" class="style5">[Generated content here]</p>.
                remember to cross reference the html you are generating and the applicant profile to make sure that the information is accurate.Only generate the html. 
                Do not include any text/comments/recommendations/warnings before or after that is not html. speak in first person.
               `

        }],
        //todo: try to limit amount of responses
        n: 1,
        temperature: 0.1,
        model: "gpt-4-1106-preview",
    });
    let websiteSubTitle = websiteSubTitleCompletion.choices[0].message.content;
    websiteSubTitle = websiteSubTitle.replace(/^```html\n?|\n?```$/g, "").trim();
    console.log('websiteSubTitle: ', websiteSubTitle);


    //if the req.user.id is already in the PersonalWebsite collection, then update the htmlContent and imageURL
    const personalWebsiteExists = await PersonalWebsite.findOne({ userID: req.user.id });

    //make sure that the user's website exists
    if (personalWebsiteExists) {
        //get the html content of the website
        let htmlContent = personalWebsiteExists.htmlContent;
        htmlContent = htmlContent.replace('<!-- sub title -->', websiteSubTitle);
        //then update the htmlContent in database
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: htmlContent
        });
    } else { // throw an app error if the user's website does not exist
        throw new AppError('Personalized website not found', 404);
    }


    return res.send("success");
}));



//generate the sub-title of the website
router.post('/generate-schoolSummary', isLoggedIn, wrapAsync(async (req, res) => {
    const resumeText = req.body.resumeText;
    const websiteSchoolSummaryCompletion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: `Create a detailed and engaging paragraph for a personal profile website, highlighting the applicant's educational achievements, certifications, and current studies. The content should be suitable for an HTML paragraph with a <span> tag and reflect the applicant's academic journey. The short paragraph should only be about school and direct and straight to the point. do not 
                include any details about professional experience or anything unrelated to school/certificates. Here are the details:

                - Applicant's resume: ${resumeText}...

                Format the output as an HTML paragraph with id="text09" and class="style1", using <span> tags to encapsulate the information. It should convey the applicant's academic credentials and aspirations, similar to the following format:
                <p id="text09" class="style1">
                    <span class="p">
                        [Generated content here]
                    </span>
                </p>.
                ... here is an example template of the html that should be generated:  <p id="text09" class="style1">
                <span class="p">
                    I am preparing a Double Degree at EFAP &amp; Essca Shanghai (2025).
                    <br />
                    <br />
                    An MBA specialized in digital marketing, by EFAP &amp; Essca Shanghai
                    <br />
                    <br />
                    A Master of Science in EU-Asia Digital Marketing and Business, by ESSCA
                </span>
            </p> ...note that this is only an example and the content should be different. the degrees that the applicant is pursuing will most likely be different.
             the point of the example is to show how the length of the paragraph is around 3-4 sentences, and should relate to the resume given to you. follow the html format closely. 
             Only generate the html. Do not include any text/comments/recommendations/warnings before or after that is not html. make the paragraph very short and straight to the point. do not
             make it longer than the xample i have given you. speak in first person.`
        }],
        //todo: try to limit amount of responses
        n: 1,
        temperature: 0.1,
        model: "gpt-4-1106-preview",
    });
    let websiteSchoolSummary = websiteSchoolSummaryCompletion.choices[0].message.content;
    websiteSchoolSummary = websiteSchoolSummary.replace(/^```html\n?|\n?```$/g, "").trim();
    console.log('websiteSchoolSummary: ', websiteSchoolSummary);


    //if the req.user.id is already in the PersonalWebsite collection, then update the htmlContent and imageURL
    const personalWebsiteExists = await PersonalWebsite.findOne({ userID: req.user.id });

    //make sure that the user's website exists
    if (personalWebsiteExists) {
        //get the html content of the website
        let htmlContent = personalWebsiteExists.htmlContent;
        htmlContent = htmlContent.replace('<!-- school summary -->', websiteSchoolSummary);
        //then update the htmlContent in database
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: htmlContent
        });
    } else { // throw an app error if the user's website does not exist
        throw new AppError('Personalized website not found', 404);
    }


    return res.send("success");
}));



router.post('/generate-SchoolDetails', isLoggedIn, wrapAsync(async (req, res) => {
    const resumeText = req.body.resumeText;
    const websiteSchoolDetailsCompletion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: `Create a paragraph that precisely matches the style, structure, and formatting of the given HTML template example, while varying the content to suit the applicant's resume. The output should maintain the same use of <div>, <p>, and <span> elements, including classes and IDs, but the text within these tags should reflect the applicant's educational background. here is the resume
                of the applicant:  ${resumeText}... Here is the template to emulate:


                <div id="container03" class="style1 container default full">
                    <div class="wrapper">
                        <div class="inner">
                            <p id="text03" class="style5">[Brief description of current study or significant educational pursuit, and what the insitution is known for]</p>

                            <p id="text05" class="style5">


                                <span class="p">My courses at [Institution] are composed of :</span>
                                <span class="p">
                                    - [List of key courses or subjects]
                                </span>
                                <span class="p">[Statement on how these courses apply to various sectors]</span>
                            </p>
                        </div>
                    </div>
                </div>...



                here is an example of another applicant's school section of their website. this is what the structure of the html should look like:
                <div id="container03" class="style1 container default full">
                <div class="wrapper">
                    <div class="inner">
                        <p id="text03" class="style5">I am pursuing a Double Degree - Digital Marketing &amp;
                            Business at EFAP &amp; Essca Shanghai (2025). EFAP is known for it's robust and rigourous marketing programs, 
                            and competed they one various marketing competitinos</p>

                        <p id="text05" class="style5">

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
                 but with content tailored to the applicant's specific educational experiences. This means that the content within the tags will be different for the applicant you are generating content for. The html above is only an example that shows
                  the general structure of the html tags. Ensure the tone is engaging and the content is informative,
                  fitting seamlessly into the provided template style. If the courses the applicant has taken can not be found, then generate ones that you think the applicant has taken instead of just copying the ones
                  from the html template example, or even just mention what they might have learned from their degree/ certifications in place of the courses in the example shown. 
                  Also, only mention that they are "currently studying" if they are still in school which can be checked by the date of they degree.
                  remember to cross reference the html you are generating with the resume to make sure that the information is accurate.
                  Only generate the html. Do not include any text/comments/recommendations/warnings before or after that is not html. speak in first person.`
        }],
        //todo: try to limit amount of responses
        n: 1,
        temperature: 0.1,
        model: "gpt-4-1106-preview",
    });
    let websiteSchoolDetails = websiteSchoolDetailsCompletion.choices[0].message.content;
    websiteSchoolDetails = websiteSchoolDetails.replace(/^```html\n?|\n?```$/g, "").trim();
    console.log('websiteSchoolDetails: ', websiteSchoolDetails);

    //if the req.user.id is already in the PersonalWebsite collection, then update the htmlContent and imageURL
    const personalWebsiteExists = await PersonalWebsite.findOne({ userID: req.user.id });

    //make sure that the user's website exists
    if (personalWebsiteExists) {
        //get the html content of the website
        let htmlContent = personalWebsiteExists.htmlContent;
        htmlContent = htmlContent.replace('<!-- school details -->', websiteSchoolDetails);
        //then update the htmlContent in database
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: htmlContent
        });
    } else { // throw an app error if the user's website does not exist
        throw new AppError('Personalized website not found', 404);
    }


    return res.send("success");
}));



router.post('/generate-Experiences', isLoggedIn, wrapAsync(async (req, res) => {
    const resumeText = req.body.resumeText;
    const websiteExperiencesCompletion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: `Create content for the 'My Experiences' section on a personal profile website, focusing on three of the most significant professional experiences. if you have multiple
            jobs to choose from in the resume, then choose the 3 most significiant. for exmaple, an accounting job is more significiant than a mcdonalds cashier job, and a senior level job
            is more significiant than a junior level job. The output should closely follow the structure and styling of the provided HTML example, including separate <ul> elements for each experience. Here are the details:

                - Section Title: <h2 id="text02" class="style4">My Experiences</h2>
                - One-Liner Introduction: Write a concise, one-sentence introduction in a <p> tag with id="text14" and class="style7".
                - Experience List: Generate three separate <ul> elements, each with a unique ID and class="style2 links". Within each <ul>, include one <li> item with class="n01" and an <a> tag linking to the detailed experience.

                Specific Structure and IDs for Each Experience:
                1. <ul id="links04" class="style2 links"><li class="n01"><a href="#experience1">[First Experience Title]</a></li></ul>
                2. <ul id="links05" class="style2 links"><li class="n01"><a href="#experience2">[Second Experience Title]</a></li></ul>
                3. <ul id="links03" class="style2 links"><li class="n01"><a href="#experience3">[Third Experience Title]</a></li></ul>

                - applicant's resume: ${resumeText}...

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

                The output should reflect the applicant's professional journey as described in 'applicantInfo', with the HTML formatting and styling exactly as shown in the example. Ensure that each experience is presented in its own <ul> for clarity and visual consistency with the provided template. 
                aplicant's resume.Only generate the html. Do not include any text/comments/recommendations/warnings before or after that is not html. speak in first person.`
        }],

        //todo: try to limit amount of responses
        n: 1,
        temperature: 0.1,
        model: "gpt-4-1106-preview",
    });
    let websiteExperiences = websiteExperiencesCompletion.choices[0].message.content;
    websiteExperiences = websiteExperiences.replace(/^```html\n?|\n?```$/g, "").trim();
    console.log('websiteExperiences: ', websiteExperiences);

    //if the req.user.id is already in the PersonalWebsite collection, then update the htmlContent and imageURL
    const personalWebsiteExists = await PersonalWebsite.findOne({ userID: req.user.id });

    //make sure that the user's website exists
    if (personalWebsiteExists) {
        //get the html content of the website
        let htmlContent = personalWebsiteExists.htmlContent;
        htmlContent = htmlContent.replace('<!-- experiences -->', websiteExperiences);
        //then update the htmlContent in database
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: htmlContent
        });
        //then update the websiteExperiences in database
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            websiteExperiences: websiteExperiences
        });
    } else { // throw an app error if the user's website does not exist
        throw new AppError('Personalized website not found', 404);
    }


    return res.send("success");
}));




router.post('/generate-Experience1', isLoggedIn, wrapAsync(async (req, res) => {
    const resumeText = req.body.resumeText;
    //get the websiteExperiences from the database
    const personalWebsiteExists = await PersonalWebsite.findOne({ userID: req.user.id });
    //throw an error if the website does not exist
    if (!personalWebsiteExists) {
        throw new AppError('Personalized website not found', 404);
    }
    //get the websiteExperiences from the database
    const websiteExperiences = personalWebsiteExists.websiteExperiences;


    const websiteExperience1Completion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: ` applicant Profile Overview (websiteExperiences variable):
                ${websiteExperiences}...
                - applicant's resume: ${resumeText}...
                Generate a general 2 paragraph description for the first professional experience listed in the 'websiteExperiences' variable. The content should match the format of the provided HTML template and be as engaging and informative as the example. Here are the specifics:

                - Experience Title: Extracted from the first list item in 'websiteExperiences'.
                - Format to Follow:
                    <div id="container04" class="style1 container">
                        <div class="wrapper">
                            <div class="inner">
                                <p id="text07" class="style5">
                                    <span class="p">[general description of the experience, similar to the example]
                                    <br />
                                    br />
                                    Here is what I learned from this experience:
                                    <br>
                                    &bull; [first learning point]
                                    <br />
                                    &bull; [second learning point]
                                    <br />
                                    &bull; [third learning point]</span>

                                </p>
                            </div>
                        </div>
                    </div>...

                    here is an example of the html that should be generated:
                    <div id="container04" class="style1 container default full">
                    <div class="wrapper">
                        <div class="inner">
                            <p id="text07" class="style5">

                                <span class="p">
                                    I did an internship at
                                    <strong>La Folie Douce</strong>
                                    I was in charge of several key missions.

                                    I managed the social media activity of La Folie Douce Les Arcs,
                                    which involved creating and posting engaging content on a regular basis to keep
                                    our audience engaged. I also managed the company&#39;s web activity by working
                                    on SEO to improve the visibility of our website.
                                    <br>
                                    <br />
                                    Here is what I learned from this experience:
                                    <br>
                                    &bull; [first learning point]
                                    <br />
                                    &bull; [second learning point]
                                    <br />
                                    &bull; [third learning point]</span>
                                </span>

                            </p>

                        </div>
                    </div>
                </div>...

                - Content Requirements:
                    1. The description should relate back to the role and company of the first experience listed in 'websiteExperiences', which was given to you earlier:
                    2. Highlight key responsibilities, projects, and the impact made during this experience.
                    3. Include insights or skills gained, emphasizing how this experience is relevant to the applicant's professional growth.





                    make sure to add the <strong> tag where you see fit.Ensure the output is tailored to reflect the specifics of the first experience in 'websiteExperiences', adhering to the style and structure of the HTML example provided. The content should be detailed, reflective of the applicant's role and contributions, and formatted with multiple <span> tags within the <p> tag, as shown in the template... 
              Only generate the html. Do not include any text/comments/recommendations/warnings before or after that is not html. the example i have given you is a bit lengthy, so try to make the content a bit shorter, such as making it only 1 paragraph and 3 bullet points of 
              what the appilcant learned or what they may have learned from the experience. you do not 
              have to stick exactly to the example, but try to make it similar. try to add bullet points where you can in order to make it shorter and more concise.keep the paragraph less than 40 words. keep the words
              in the bullet points less than 5 words each. speak in first person.`
        }],

        //todo: try to limit amount of responses
        n: 1,
        temperature: 0.1,
        model: "gpt-4-1106-preview",
    });
    let websiteExperience1 = websiteExperience1Completion.choices[0].message.content;
    websiteExperience1 = websiteExperience1.replace(/^```html\n?|\n?```$/g, "").trim();
    console.log('websiteExperience1: ', websiteExperience1);


    //if the req.user.id is already in the PersonalWebsite collection, then update the htmlContent and imageURL


    //make sure that the user's website exists
    if (personalWebsiteExists) {
        //get the html content of the website
        let htmlContent = personalWebsiteExists.htmlContent;
        htmlContent = htmlContent.replace('<!-- experience1 -->', websiteExperience1);
        //then update the htmlContent in database
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: htmlContent
        });
    } else { // throw an app error if the user's website does not exist
        throw new AppError('Personalized website not found', 404);
    }

    return res.send("success");
}));


router.post('/generate-Experience2', isLoggedIn, wrapAsync(async (req, res) => {
    const resumeText = req.body.resumeText;
    //get the websiteExperiences from the database
    const personalWebsiteExists = await PersonalWebsite.findOne({ userID: req.user.id });
    //throw an error if the website does not exist
    if (!personalWebsiteExists) {
        throw new AppError('Personalized website not found', 404);
    }
    //get the websiteExperiences from the database
    const websiteExperiences = personalWebsiteExists.websiteExperiences;


    const websiteExperience2Completion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: ` applicant Profile Overview (websiteExperiences variable):
                ${websiteExperiences}...
                - here is the resume of the applicant: ${resumeText}...Generate a general 2 paragraph description for the second professional experience listed in the 'websiteExperiences' variable. The content should match the format of the provided HTML template and be as engaging and informative as the example. Here are the specifics:

                - Experience Title: Extracted from the first list item in 'websiteExperiences'.
                - Format to Follow:
                    <div id="container04" class="style1 container">
                        <div class="wrapper">
                            <div class="inner">
                                <p id="text07" class="style5">
                                    <span class="p">[general description of the experience, similar to the example]
                                    <br />
                                    br />
                                    Here is what I learned from this experience:
                                    <br>
                                    &bull; [first learning point]
                                    <br />
                                    &bull; [second learning point]
                                    <br />
                                    &bull; [third learning point]</span>

                                </p>
                            </div>
                        </div>
                    </div>...

                    here is an example of the html that should be generated:
                    <div id="container04" class="style1 container default full">
                    <div class="wrapper">
                        <div class="inner">
                            <p id="text07" class="style5">

                            <span class="p">
                                    I did an internship at
                                    <strong>La Folie Douce</strong>
                                    I was in charge of several key missions.

                                    I managed the social media activity of La Folie Douce Les Arcs,
                                    which involved creating and posting engaging content on a regular basis to keep
                                    our audience engaged. I also managed the company&#39;s web activity by working
                                    on SEO to improve the visibility of our website.
                                    <br>
                                    <br />
                                    Here is what I learned from this experience:
                                    <br>
                                    &bull; [first learning point]
                                    <br />
                                    &bull; [second learning point]
                                    <br />
                                    &bull; [third learning point]</span>
                                </span>

                            </p>

                        </div>
                    </div>
                </div>...

                - Content Requirements:
                    1. The description should be specific to the role and company of the second experience listed in 'websiteExperiences'.
                    2. Highlight key responsibilities, projects, and the impact made during this experience.
                    3. Include insights or skills gained, emphasizing how this experience is relevant to the applicant's professional growth.



               make sure to add the <strong> tag where you see fit. Ensure the output is tailored to reflect the specifics of the second experience in 'websiteExperiences', adhering to the style and structure of the HTML example provided. The content should be detailed, reflective of the applicant's role and contributions, and formatted with multiple <span> tags within the <p> tag, as shown in the template...
              Only generate the html. Do not include any text/comments/recommendations/warnings before or after that is not html.the example i have given you is a bit lengthy, so try to make the content a bit shorter, such as making it only 2 paragraphs. you do not 
              have to stick exactly to the example, but try to make it similar. try to add bullet points where you can in order to make it shorter and more concise.keep the paragraph less than 40 words. keep the words
              in the bullet points less than 5 words each. speak in first person.`
        }],

        //todo: try to limit amount of responses
        n: 1,
        temperature: 0.1,
        model: "gpt-4-1106-preview",
    });
    let websiteExperience2 = websiteExperience2Completion.choices[0].message.content;
    websiteExperience2 = websiteExperience2.replace(/^```html\n?|\n?```$/g, "").trim();
    console.log('websiteExperience2: ', websiteExperience2);




    //make sure that the user's website exists
    if (personalWebsiteExists) {
        //get the html content of the website
        let htmlContent = personalWebsiteExists.htmlContent;
        htmlContent = htmlContent.replace('<!-- experience2 -->', websiteExperience2);
        //then update the htmlContent in database
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: htmlContent
        });
    } else { // throw an app error if the user's website does not exist
        throw new AppError('Personalized website not found', 404);
    }


    return res.send("success");
}));




router.post('/generate-Experience3', isLoggedIn, wrapAsync(async (req, res) => {
    const resumeText = req.body.resumeText;

    //get the websiteExperiences from the database
    const personalWebsiteExists = await PersonalWebsite.findOne({ userID: req.user.id });
    //throw an error if the website does not exist
    if (!personalWebsiteExists) {
        throw new AppError('Personalized website not found', 404);
    }
    //get the websiteExperiences from the database
    const websiteExperiences = personalWebsiteExists.websiteExperiences;


    const websiteExperience3Completion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: ` applicant Profile Overview (websiteExperiences variable):
                ${websiteExperiences}...
                - applicant's resume: ${resumeText}...
                Generate a general 2 paragraph description for the third professional experience listed in the 'websiteExperiences' variable. The content should match the format of the provided HTML template and be as engaging and informative as the example. Here are the specifics:

                - Experience Title: Extracted from the first list item in 'websiteExperiences'.
                - Format to Follow:
                    <div id="container04" class="style1 container default full">
                        <div class="wrapper">
                            <div class="inner">
                                <p id="text07" class="style5">
                                    <span class="p">[general description of the experience, similar to the example]
                                    <br />
                                    br />
                                    Here is what I learned from this experience:
                                    <br>
                                    &bull; [first learning point]
                                    <br />
                                    &bull; [second learning point]
                                    <br />
                                    &bull; [third learning point]</span>

                                </p>
                            </div>
                        </div>
                    </div>...

                    here is an example of the html that should be generated:
                    <div id="container04" class="style1 container default full">
                    <div class="wrapper">
                        <div class="inner">
                            <p id="text07" class="style5">

                                <span class="p">
                                    I did an internship at
                                    <strong>La Folie Douce</strong>
                                    I was in charge of several key missions.

                                    I managed the social media activity of La Folie Douce Les Arcs,
                                    which involved creating and posting engaging content on a regular basis to keep
                                    our audience engaged. I also managed the company&#39;s web activity by working
                                    on SEO to improve the visibility of our website.
                                    <br>
                                    <br />
                                    Here is what I learned from this experience:
                                    <br>
                                    &bull; [first learning point]
                                    <br />
                                    &bull; [second learning point]
                                    <br />
                                    &bull; [third learning point]</span>
                                </span>

                            </p>

                        </div>
                    </div>
                </div>...

                - Content Requirements:
                    1. The description should be specific to the role and company of the third experience listed in 'websiteExperiences'.
                    2. Highlight key responsibilities, projects, and the impact made during this experience.
                    3. Include insights or skills gained, emphasizing how this experience is relevant to the applicant's professional growth.



                    make sure to add the <strong> tag where you see fit.Ensure the output is tailored to reflect the specifics of the third experience in 'websiteExperiences', adhering to the style and structure of the HTML example provided. The content should be detailed, reflective of the applicant's role and contributions, and formatted with multiple <span> tags within the <p> tag, as shown in the template. 
                Only generate the html. Do not include any text/comments/recommendations/warnings before or after that is not html.the example i have given you is a bit lengthy, so try to make the content a bit shorter, such as making it only 2 paragraphs. you do not 
                have to stick exactly to the example, but try to make it similar. try to add bullet points where you can in order to make it shorter and more concise. keep the paragraph less than 40 words. keep the words
                in the bullet points less than 5 words each. speak in first person.`
        }],

        //todo: try to limit amount of responses
        n: 1,
        temperature: 0.1,
        model: "gpt-4-1106-preview",
    });
    let websiteExperience3 = websiteExperience3Completion.choices[0].message.content;
    websiteExperience3 = websiteExperience3.replace(/^```html\n?|\n?```$/g, "").trim();
    console.log('websiteExperience3: ', websiteExperience3);




    //make sure that the user's website exists
    if (personalWebsiteExists) {
        //get the html content of the website
        let htmlContent = personalWebsiteExists.htmlContent;
        htmlContent = htmlContent.replace('<!-- experience3 -->', websiteExperience3);
        //then update the htmlContent in database
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: htmlContent
        });
    } else { // throw an app error if the user's website does not exist
        throw new AppError('Personalized website not found', 404);
    }

    return res.send("success");
}));


router.post('/generate-Contact', isLoggedIn, wrapAsync(async (req, res) => {
    const resumeText = req.body.resumeText;
    const websiteContactCompletion = await openai.chat.completions.create({
        messages: [{
            role: "system", content: `here is the resume of the applicant: ${resumeText}... please fill in this html:
            <ul id="icons01" class="style1 icons">
                                    <li>
                                        <a class="n01" href="tel:" aria-label="Mobile">
                                            <svg>
                                                <use xlink:href="#icon-9570a68733e3ff2abd643efda8a53b3c"></use>
                                            </svg>
                                            <span class="label">Mobile</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="n02"
                                            href=""
                                            aria-label="Email">
                                            <svg>
                                                <use xlink:href="#icon-c0646d28bbeb18e39eb973f96b44bd0f"></use>
                                            </svg>
                                            <span class="label">Email</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="n03" href=""
                                            aria-label="LinkedIn">
                                            <svg>
                                                <use xlink:href="#icon-bf393d6ea48a4e69e1ed58a3563b94a5"></use>
                                            </svg>
                                            <span class="label">LinkedIn</span>
                                        </a>
                                    </li>
                                </ul> ... the phone number should be the one in the resume. the email should be the one in the resume. the linkedin should be the one in the resume.
                                  Only generate the html. Do not include any text/comments/recommendations/warnings before or after that is not html. you may a contact method if the applicant does not have one.
                                  for example, if the applicant does not have a linkedin, then you may remove that html section. if the applicant does not have a phone number, then you may remove that html section.
                                  speak in first person.
                                `
        }],

        //todo: try to limit amount of responses
        n: 1,
        temperature: 0.1,
        model: "gpt-4-1106-preview",
    });
    let websiteContact = websiteContactCompletion.choices[0].message.content;
    websiteContact = websiteContact.replace(/^```html\n?|\n?```$/g, "").trim();
    console.log("website generated");


    //if the req.user.id is already in the PersonalWebsite collection, then update the htmlContent and imageURL
    const personalWebsiteExists = await PersonalWebsite.findOne({ userID: req.user.id });

    //make sure that the user's website exists
    if (personalWebsiteExists) {
        //get the html content of the website
        let htmlContent = personalWebsiteExists.htmlContent;
        htmlContent = htmlContent.replace('<!-- contact -->', websiteContact);
        //then update the htmlContent in database
        await PersonalWebsite.updateOne({ userID: req.user.id }, {
            htmlContent: htmlContent
        });
    } else { // throw an app error if the user's website does not exist
        throw new AppError('Personalized website not found', 404);
    }


    return res.send("success");


}));



module.exports = router;


