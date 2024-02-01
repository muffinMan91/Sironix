const fs = require('fs');
const path = require('path');
const GPTContact = require('../../../models/GPTContact.js');
const axios = require('axios');

function fillTemplateWithData(data) {



    // Load your HTML template
    const templatePath = path.join(__dirname, '..', '..', '..', 'public', 'plainResume.html');
    let resumeHtml = fs.readFileSync(templatePath, 'utf8');

    if (data.fullName) {
        // name
        resumeHtml = resumeHtml.replace('<!-- fullName -->', data.fullName);
    }


    if (data.contact) {
        // contact
        let contactHtml = data.contact ? data.contact.map(item => `<li>${item}</li>`).join('') : '';
        resumeHtml = resumeHtml.replace('<!-- contact -->', contactHtml);

    }


    if (data.profileSummary) {
        //profileSummary
        resumeHtml = resumeHtml.replace('<!-- profile summary -->', data.profileSummary);

    } else {
        //if there is no profile summary, then replace <h2>Profile Summary</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Profile Summary</h2>', '');
    }


    if (data.experiences) {
        // experiences
        let experiencesHtml = data.experiences.map((exp, index) => {
            return (index > 0 ? '<hr>' : '') +
                `<h3><span>${exp.role}, ${exp.company}</span> <span>${exp.period}</span></h3>
            <p>${exp.description}</p>
            <ul>` +
                exp.bulletPoints.map(point => `<li>${point}</li>`).join('') +
                `</ul>`;
        }).join('');
        resumeHtml = resumeHtml.replace('<!-- experiences -->', experiencesHtml);

    } else {
        //if there is no experiences, then replace <h2>Experiences</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Experiences</h2>', '');
    }




    if (data.volunteers) {
        // volunteer
        let volunteerHtml = data.volunteers.map((vol, index) => {
            return (index > 0 ? '<hr>' : '') +
                `<h3><span>${vol.role}, ${vol.company}</span> <span>${vol.period}</span></h3>
            <p>${vol.description}</p>
            <ul>` +
                vol.bulletPoints.map(point => `<li>${point}</li>`).join('') +
                `</ul>`;
        }).join('');
        resumeHtml = resumeHtml.replace('<!-- volunteer -->', volunteerHtml);

    } else {
        //if there is no volunteer, then replace <h2>Volunteer</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Volunteer</h2>', '');
    }


    if (data.projects) {
        //projects
        let projectsHtml = data.projects.map((proj, index) => {
            return (index > 0 ? '<hr>' : '') +
                `<h3><span>${proj.title}</span> <span>${proj.time}</span></h3>
            <p>${proj.description}</p>
            <ul>` +
                proj.bulletPoints.map(point => `<li>${point}</li>`).join('') +
                `</ul>`;
        }).join('');
        resumeHtml = resumeHtml.replace('<!-- projects -->', projectsHtml);

    } else {
        //if there is no projects, then replace <h2>Projects</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Projects</h2>', '');
    }

    if (data.awards) {
        //awards and recognition
        let awardsHtml = data.awards.map((award, index) => {
            return (index > 0 ? '<hr>' : '') +
                `<h3><span>${award.title}</span> <span>${award.year}</span></h3>
            <p>${award.description}</p>`;
        }).join('');
        resumeHtml = resumeHtml.replace('<!-- awards / recognition -->', awardsHtml);

    } else {
        //if there is no awards, then replace <h2>Awards and Recognition</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Awards / Recognition</h2>', '');
    }

    if (data.education) {
        // education and certifications
        let educationHtml = data.education.map((edu, index) => {
            return (index > 0 ? '<hr>' : '') +
                `<h3><span>${edu.title}</span> <span>${edu.period}</span></h3>
            <ul>` +
                edu.details.map(detail => `<li>${detail}</li>`).join('') +
                `</ul>`;
        }).join('');
        resumeHtml = resumeHtml.replace('<!-- education / certifications -->', educationHtml);
    } else {
        //if there is no education, then replace <h2>Education and Certifications</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Education / Certifications</h2>', '');
    }

    if (data.publications) {

        //publications
        let publicationsHtml = `<ul>` +
            data.publications.map(pub => `<li>${pub}</li>`).join('') +
            `</ul>`;
        resumeHtml = resumeHtml.replace('<!-- publications -->', publicationsHtml);
    } else {
        //if there is no publications, then replace <h2>Publications</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Publications</h2>', '');
    }

    if (data.skillsInterests) {
        // skills/interests 
        let skillsInterestsHtml = `<ul>` +
            data.skillsInterests.map(skill => `<li>${skill}</li>`).join('') +
            `</ul>`;
        resumeHtml = resumeHtml.replace('<!-- skills / interests -->', skillsInterestsHtml);
    } else {
        //if there is no skills/interests, then replace <h2>Skills / Interests</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Skills / Interests</h2>', '');
    }

    return resumeHtml;
}

// Logic to convert HTML to PDF using the external API
async function convertHtmlToPdf(html) {


    // Convert HTML to Base64
    let base64Html = Buffer.from(html).toString('base64');
    // API URL and Secret Key
    const apiUrl = "https://v2.convertapi.com/convert/html/to/pdf";
    const secretKey = "taLLzwxac5PkuXtC";

    // Prepare the request body
    const requestBody = {
        "Parameters": [
            {
                "Name": "File",
                "FileValue": {
                    "Name": "resume.html",
                    "Data": base64Html
                }
            },
            {
                "Name": "StoreFile",
                "Value": true
            }
        ]
    };

    try {
        // Make the API request
        const response = await axios.post(apiUrl + '?Secret=' + secretKey, requestBody, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Check if the response has the 'Files' array with at least one file
        if (response.data && response.data.Files && response.data.Files.length > 0) {
            const fileUrl = response.data.Files[0].Url; // Extract the URL of the converted file
            const fileName = response.data.Files[0].FileName; // Extract the name of the converted fileds

            return fileUrl;
        } else {
            throw new Error('File conversion failed or no file in response');
        }
    } catch (error) {
        console.error('Error in API request:', error);
        throw new Error('Error converting HTML to PDF'); // Throw a new error

    }
}


async function createResumeFromData(userData) {
    console.log("creating resume from data 1");
    // Check if the contact already exists in the database
    const existingContact = await GPTContact.findOne({
        email: userData.email
        // You can also include other unique fields like phone number if needed
    });

    let newContact;

    if (!existingContact) {
        // If the contact doesn't exist, create and save a new contact
        newContact = new GPTContact({
            name: userData.fullName,
            email: userData.email,
            phone: userData.phone
        });
        await newContact.save();
    }
    else {
        //increment the number of resumes generated
        existingContact.resumesGenerated++;
        await existingContact.save();
    }

    //fill the html contect with the user data
    let filledHtml = fillTemplateWithData(userData);
    //if userData.tooLong is true, fix the css
    if (userData.tooLong) {
        //call function for fixing css
        filledHtml = fixCss(filledHtml);
    }

    let pdfUrl = await convertHtmlToPdf(filledHtml);


    return pdfUrl;
}


// Update the export
module.exports = {
    fillTemplateWithData,
    convertHtmlToPdf,
    createResumeFromData
};

