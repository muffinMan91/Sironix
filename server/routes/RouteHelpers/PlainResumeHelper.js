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



    if (data.email || data.phone || data.linkedin || data.location || data.github || data.customLink) {

        // Starting the contactHtml string with the opening ul tag and inline style
        let contactHtml = '<ul style="font-weight: 900;">';

        if (data.email) {
            contactHtml += `<li><i class="fa-regular fa-envelope"></i> ${data.email}</li>`;
        }
        if (data.phone) {
            contactHtml += `<li><i class="fa-regular fa-phone"></i> ${data.phone}</li>`;
        }
        if (data.linkedin) {
            contactHtml += `<li><i class="fa-brands fa-linkedin"></i> ${data.linkedin}</li>`;
        }
        if (data.location) {
            contactHtml += `<li><i class="fa-regular fa-location-dot"></i> ${data.location}</li>`;
        }
        if (data.github) {
            contactHtml += `<li><i class="fa-brands fa-github"></i> ${data.github}</li>`;
        }
        if (data.customLink) {
            // Assuming customLink does not need an icon
            contactHtml += `<li>${data.customLink}</li>`;
        }

        // Closing the ul tag at the end of the string
        contactHtml += '</ul>';

        resumeHtml = resumeHtml.replace('<!-- contact -->', contactHtml);

    }


    if (data.profileSummary) {
        //profileSummary
        resumeHtml = resumeHtml.replace('<!-- profile summary -->', data.profileSummary);

    } else {
        //if there is no profile summary, then replace <h2>Profile Summary</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Profile Summary</h2>', '');
    }

    if (data.education) {
        // education and certifications
        let educationHtml = data.education.map((edu, index) => {
            return (index > 0 ? '<hr>' : '') +
                `<h3><span class="name">${edu.title}</span><span class="role">${edu.name}</span> <span class="date">${edu.period}</span></h3>
            <ul>` +
                edu.details.map(detail => `<li>${detail}</li>`).join('') +
                `</ul>`;
        }).join('');
        resumeHtml = resumeHtml.replace('<!-- education / certifications -->', educationHtml);
    } else {
        //if there is no education, then replace <h2>Education and Certifications</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Education / Certifications</h2>', '');
    }


    if (data.experiences) {
        // experiences
        let experiencesHtml = data.experiences.map((exp) => {
            return `<h3>
                        <span class="name">${exp.company}</span>,
                        <span class="location"><i class="fa-solid fa-location-dot"></i> ${exp.location}</span>
                        <span class="date">${exp.period}</span>
                    </h3>
                    <div class="role">${exp.role}</div>
                    <ul>` +
                exp.bulletPoints.map(point => `<li>${point}</li>`).join('') +
                `</ul><hr>`;
        }).join('');

        // Remove the last <hr> tag from the last experience entry
        experiencesHtml = experiencesHtml.substring(0, experiencesHtml.lastIndexOf('<hr>'));

        resumeHtml = resumeHtml.replace('<!-- experiences -->', experiencesHtml);

    } else {
        //if there is no experiences, then replace <h2>Experiences</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Experiences</h2>', '');
    }




    if (data.volunteers) {
        // volunteers
        let volunteerHtml = data.volunteers.map((vol, index) => {
            return `<h3>
                        <span class="name">${vol.company}</span>
                        <span class="role">${vol.role}</span>
                        <span class="date">${vol.period}</span>
                    </h3>
                    <p>${vol.description}</p>
                    <ul>` +
                vol.bulletPoints.map(point => `<li>${point}</li>`).join('') +
                `</ul>` +
                (index < data.volunteers.length - 1 ? '<hr>' : ''); // Add <hr> if not the last item
        }).join('');

        resumeHtml = resumeHtml.replace('<!-- volunteer -->', volunteerHtml);
    } else {
        // If there are no volunteers, then replace <h2>Volunteer</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Volunteer</h2>', '');
    }



    if (data.projects) {
        //projects
        let projectsHtml = data.projects.map((proj, index) => {
            return (index > 0 ? '<hr>' : '') +
                `<h3><span class="name">${proj.title}</span> <span class="date">${proj.time}</span></h3>
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
                `<h3><span class="name">${award.title}</span> <span class="date">${award.year}</span></h3>
            <p>${award.description}</p>`;
        }).join('');
        resumeHtml = resumeHtml.replace('<!-- awards / recognition -->', awardsHtml);

    } else {
        //if there is no awards, then replace <h2>Awards and Recognition</h2> with empty string
        resumeHtml = resumeHtml.replace('<h2>Awards / Recognition</h2>', '');
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

    if (data.skillsInterests1 || data.skillsInterests2 || data.skillsInterests3 || data.skillsInterests4 || data.skillsInterests5 || data.skillsInterests6) {
        // Aggregate skills/interests into an array
        let skillsInterestsArray = [
            data.skillsInterests1,
            data.skillsInterests2,
            data.skillsInterests3,
            data.skillsInterests4,
            data.skillsInterests5,
            data.skillsInterests6
        ].filter(skill => skill !== undefined); // Filter out undefined entries

        // Generate HTML for skills/interests
        let skillsInterestsHtml = `<ul class="skills">` +
            skillsInterestsArray.map(skill => `<li>${skill}</li>`).join('') +
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



const sampleData = {
    fullName: 'John Doe',

    email: 'example@example.com',
    phone: '(123) 456-7890',
    linkedin: 'http://yourwebsite.com',
    location: 'San Francisco, CA',
    github: 'http://yourgithub.com',
    customLink: 'Custom Link',

    profileSummary: 'Experienced Software Engineer with a passion for web development...',
    experiences: [
        {
            role: 'Senior Developer',
            company: 'Tech Company',
            location: 'San Francisco, CA', // Added location
            period: 'Jan 2020 – Present',
            description: 'Responsible for leading the development of web applications...',
            bulletPoints: [
                'Developed a full-stack web application using React and Node.js',
                'Led a team of 5 developers in a successful project',
                'Implemented advanced features, resulting in a 30% increase in efficiency'
            ]
        },
        {
            role: 'Full Stack Developer',
            company: 'Innovate Startup',
            location: 'New York, NY', // Added location
            period: 'Jan 2018 – Dec 2019',
            description: 'Played a key role in a startup company by building and maintaining several web applications from scratch.',
            bulletPoints: [
                'Developed a secure e-commerce platform using Node.js and MongoDB',
                'Integrated third-party APIs for payment processing and social media integration',
                'Improved application performance by 40% through optimization techniques'
            ]
        },
        {
            role: 'Junior Web Developer',
            company: 'Digital Solutions Inc.',
            location: 'Austin, TX', // Added location
            period: 'May 2016 – Dec 2017',
            description: 'Assisted in the development and maintenance of client websites.',
            bulletPoints: [
                'Collaborated in a team to develop custom CMS solutions',
                'Participated in code reviews and contributed to team learning',
                'Automated repetitive tasks, saving approximately 10 hours per week'
            ]
        }
    ],
    volunteers: [
        {
            role: 'Volunteer Teacher',
            company: 'Local School',
            period: '2018 - 2019',
            description: 'Taught basic programming to middle school students...',
            bulletPoints: [
                'Developed an interactive learning curriculum',
                'Organized a successful coding fair'
            ]
        },
        {
            role: 'Community Tech Mentor',
            company: 'Tech for All',
            period: '2016 - 2017',
            description: 'Mentored individuals in underrepresented communities to improve their technical skills.',
            bulletPoints: [
                'Organized weekend coding bootcamps for beginners',
                'Provided one-on-one mentoring sessions on web development basics'
            ]
        }

    ],
    projects: [
        {
            title: 'Personal Website',
            time: '2021',
            description: 'Developed a personal portfolio website to showcase projects...',
            bulletPoints: [
                'Designed with modern UI/UX principles',
                'Implemented using React and hosted on AWS'
            ]
        },
        {
            title: 'Weather App',
            time: '2020',
            description: 'Created a web application that provides real-time weather data.',
            bulletPoints: [
                'Integrated with the OpenWeatherMap API for live weather data',
                'Implemented responsive design for optimal mobile and desktop experience'
            ]
        }
    ],
    awards: [
        {
            title: 'Best Developer',
            year: '2020',
            description: 'Awarded for outstanding contributions in the field of web development'
        },
        {
            title: 'Innovative Developer of the Year',
            year: '2019',
            description: 'Recognized for developing innovative solutions in web development by the National Tech Council'
        }

    ],
    education: [
        {
            title: 'Virginia tech',
            name: 'B.S. in Computer Science',
            period: '2015 - 2019',
            details: [
                'Graduated with Honors',
                'Relevant Courses: Data Structures, Web Development, Machine Learning'
            ]
        },
        {
            title: 'Certification in Full Stack Web Development',
            name: 'Udemy',
            period: '2017 - 2018',
            details: [
                'Completed a rigorous 12-month online program',
                'Focused on JavaScript, React, Node.js, and MongoDB'
            ]
        }
    ],
    publications: [
        'Publication Title 1',
        'Publication Title 2',
        'Exploring the Future of Web Technologies',
        'Efficient Database Design for Modern Web Applications'
    ],
    skillsInterests1: 'example@example.com',
    skillsInterests2: 'some skill',
    skillsInterests3: 'some other skill',
    skillsInterests4: 'another skill',
    skillsInterests5: 'one more skill',
    skillsInterests6: 'and another skill'
};

// Generate and print the filled resume HTML
const filledResumeHtml = fillTemplateWithData(sampleData);
console.log(filledResumeHtml);


// Update the export
module.exports = {
    fillTemplateWithData,
    convertHtmlToPdf,
    createResumeFromData
};

