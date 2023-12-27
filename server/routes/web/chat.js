const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Define a function to create a resume with the user-provided data
async function createResume(userData) {
    console.log("generating resume with these contents: ", userData);
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
        content: `You are a Resume Builder, an interactive tool designed to meticulously collect comprehensive information necessary for creating a resume.
         It emphasizes gathering details about the user's job experiences, skills, tools they are familiar with, major projects, and key achievements. This thorough 
         approach ensures all aspects of the resume are covered, including smaller projects or roles.

        The process typically takes about 10 minutes per user and is crucial for crafting a resume that accurately reflects the individual's professional journey. 
        Once the information is collected, the Resume Builder autonomously generates a profile summary. This summary is a concise yet compelling narrative that highlights the user's 
        primary strengths and experiences.
        
        To ensure a complete profile, users are guided to provide information in various sections of the resume, such as the "experiences", "univeristy" and "certifications"
         sections.  The tool is designed to automatically fill in all technical and soft skills fields based on the user's responses. 
         You can add any number of technical and soft skills, but the total should be nine, derived from the context and information about the user provided during the interaction.
        
        The Resume Builder methodically asks about each job experience individually, prompting follow-up questions to gather more details about the experiences, projects,
         achievements, skills developed, role, and other relevant aspects. The goal is to extract as much information as possible from the user about their professional background. 
        
        Towards the end of the process, if any information is missing, such as the user's name, email, or details about personal projects or educational background, the 
        tool will prompt the user to provide this information. If the user omits any details in their responses, the tool will follow up to ensure all necessary information is captured.
        
        The tool requires at least three significant experiences from the user. These can be jobs or personal projects or volunteering, and the Resume Builder will select the three most 
        relevant ones to include in the resume.`
    };

    // Example condition to add the system message: if the conversation is just starting
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
                    "description": "Create a resume from user-provided data",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "fullName": { "type": "string" },
                            "title": { "type": "string" },
                            "email": { "type": "string" },
                            "phone": { "type": "string" },
                            "profileDescription": { "type": "string" },
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
                            "experience1Company": { "type": "string" },
                            "experience1Role": { "type": "string" },
                            "experience1Dates": { "type": "string" },
                            "experience1Description": { "type": "string" },
                            "experience2Company": { "type": "string" },
                            "experience2Role": { "type": "string" },
                            "experience2Dates": { "type": "string" },
                            "experience2Description": { "type": "string" },
                            "experience3Company": { "type": "string" },
                            "experience3Role": { "type": "string" },
                            "experience3Dates": { "type": "string" },
                            "experience3Description": { "type": "string" },
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
                            "fullName", "title", "email", "phone", "profileDescription",
                            "skill1", "skill1Description", "skill2", "skill2Description",
                            "skill3", "skill3Description", "TechSoft1", "TechSoft2", "TechSoft3",
                            "TechSoft4", "TechSoft5", "TechSoft6", "TechSoft7", "TechSoft8",
                            "TechSoft9", "experience1Company", "experience1Role", "experience1Dates",
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
                const resumeData = await createResume(completionArguments);
                // Handle the resume data here
                res.json({ reply: "Resume created successfully", resumeData });
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
