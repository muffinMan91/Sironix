const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const bodyParser = require('body-parser');
const { createResumeFromData } = require('../RouteHelpers/ResumeHelper.js');
const app = express();
app.use(bodyParser.json());

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Define a function to create a resume with the user-provided data
async function createResume(userData) {

    let userDataString = JSON.stringify(userData);

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are going to be given a strigified json object containing the professional experience of an applicant. You are going to generate a few
            sections for a resume, which include the profile description, 3 of the most significant/relavent skills of the applicant, and 9 technical or soft skills of the applicant, but just make
            sure that they add up to 9. Each technical or soft skill should be a maximum of 2 words long.`,
            },
            {
                role: "user", content: `here is the stringified json containing information about the applicant: ${userDataString} ... taking that information about the applicant,
          please fill in this json:    "profileDescription": { "type": "string" },
          "skill1": { "type": "string" },
          "skill1Description": { "type": "string" },
          "skill2": { "type": "string" },
          "skill2Description": { "type": "string" },
          "skill3": { "type": "string" },
          "skill3Description": { "type": "string" },
          "TechOrSoftSkill1": { "type": "string" },
          "TechOrSoftSkill2": { "type": "string" },
          "TechOrSoftSkill3": { "type": "string" },
          "TechOrSoftSkill4": { "type": "string" },
          "TechOrSoftSkill5": { "type": "string" },
          "TechOrSoftSkill6": { "type": "string" },
          "TechOrSoftSkill7": { "type": "string" },
          "TechOrSoftSkill8": { "type": "string" },
          "TechOrSoftSkill9": { "type": "string" },
      ` },
        ],
        model: "gpt-4-1106-preview",
        response_format: { type: "json_object" },
    });
    let secondHalfUserData = completion.choices[0].message.content;
    console.log("second half user data", secondHalfUserData);

    //merge the userData and the secondHalfUserData into one json object
    let secondHalfUserDataObject = JSON.parse(secondHalfUserData);

    let mergedUserData = { ...userData, ...secondHalfUserDataObject };

    console.log("merged user data", mergedUserData);

    //create the resume from the mergedUserData
    const pdfUrl = await createResumeFromData(mergedUserData);
    return pdfUrl;
}

// Route to render the chat page
router.get('/chat', (req, res) => {
    res.render('chat');
});

// Route to handle chat messages and get responses from OpenAI
router.post('/reply', async (req, res) => {
    const conversationHistory = req.body.conversationHistory; // Array of messages (user and assistant)

    // Insert a system message under certain conditions
    const systemMessage = {
        role: "system",
        content: `

        you are a freindly interrogating resume builder tool. you are trying to gather as much information as you can from the user about their professional background.
        the only things you are allowed to ask the user directly are their name, email, phone number, professional experiences such as jobs, personal projects, volunteering, or any other experiences. you can 
        also ask for their education and certifications. 
        
        The Resume Builder methodically asks about each job experience individually. After the user responds to your questions, you must prompt follow-up questions to gather more details about
         the experiences, projects,
         achievements, skills developed, role, and other relevant aspects. The goal is to extract as much information as possible from the user about their professional background. You must ask at least a single
         follow up questions for each of the user's responses.
        `
    };


    if (conversationHistory.length === 1) {
        conversationHistory.push(systemMessage);
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4-1106-preview", // or your desired model
            messages: conversationHistory,
            "functions": [
                {
                    "name": "createResume",
                    "description": "generate pdf link to a resume generated from user-provided data",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "fullName": { "type": "string" },
                            "title": { "type": "string" },
                            "email": { "type": "string" },
                            "phone": { "type": "string" },
                            "experience1Company": { "type": "string" },
                            "experience1Role": { "type": "string" },
                            "experience1Dates": { "type": "string" },
                            "experience1Description": {
                                "type": "string", "description": `the details the user gives you about their first experience. you must ask the applicant follow up questions at least twice to extract 
                            more details about the experience such as , projects worked on,achievements, skills developed, role, and other follow up details you would like to ask. 
                            The goal is to extract as much information as possible from the user about their professional background. the experience description that
                            you create must be atleast 4 sentences long.`,
                            },
                            "experience2Company": { "type": "string" },
                            "experience2Role": { "type": "string" },
                            "experience2Dates": { "type": "string" },
                            "experience2Description": {
                                "type": "string", "description": `the details the user gives you about their second experience. you must ask the applicant follow up questions at least twice to extract 
                            more details about the experience such as , projects worked on,achievements, skills developed, role, and other follow up details you would like to ask. 
                            The goal is to extract as much information as possible from the user about their professional background. the experience description that
                            you create must be atleast 4 sentences long.`,
                            },
                            "experience3Company": { "type": "string" },
                            "experience3Role": { "type": "string" },
                            "experience3Dates": { "type": "string" },
                            "experience3Description": {
                                "type": "string", "description": `the details the user gives you about their third experience. you must ask the applicant follow up questions at least twice to extract 
                            more details about the experience such as , projects worked on, achievements, skills developed, role, and other follow up details you would like to ask. 
                            The goal is to extract as much information as possible from the user about their professional background. the experience description that
                            you create must be atleast 4 sentences long.`,
                            },
                            "universityName": { "type": "string" },
                            "universityCity": { "type": "string" },
                            "universityState": { "type": "string" },
                            "degreeType": { "type": "string" },
                            "degreeFieldOfStudy": { "type": "string" },
                            "gpa": { "type": "string" },
                            "certification1Name": { "type": "string" },
                            "certification1Origin": { "type": "string" },
                            "certification1Date": { "type": "string" },
                            "certification2Name": { "type": "string" },
                            "certification2Origin": { "type": "string" },
                            "certification2Date": { "type": "string" }
                        },
                        "required": [
                            "fullName", "title", "email", "phone", "experience1Company", "experience1Role", "experience1Dates",
                            "experience1Description", "experience2Company", "experience2Role",
                            "experience2Dates", "experience2Description", "experience3Company",
                            "experience3Role", "experience3Dates", "experience3Description",
                            "universityName", "universityCity", "universityState", "degreeType",
                            "degreeFieldOfStudy", "gpa", "certification1Name", "certification1Origin",
                            "certification1Date", "certification2Name", "certification2Origin", "certification2Date"
                        ]
                    }
                }
            ]

        });

        // Check if the response is a function call
        if (response.choices[0].message.function_call) {
            const functionCallName = response.choices[0].message.function_call.name;
            if (functionCallName === "createResume") {
                const completionArguments = JSON.parse(response.choices[0].message.function_call.arguments);
                const resumeLink = await createResume(completionArguments);
                console.log("Resume data:", resumeLink)
                // Handle the resume data here
                res.json({ reply: "Resume created successfully", resumeLink });
            }
        } else {
            const assistantMessage = response.choices[0].message.content;
            res.json({ reply: assistantMessage });
        }
    } catch (error) {
        console.error("Error in OpenAI response:", error);
        res.status(500).send('Error processing your request');
    }
});

module.exports = router;
