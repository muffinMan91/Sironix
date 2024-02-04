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
            contactHtml += `<li><svg width="30px" height="30px" viewBox="0 -3.5 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
            fill="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <title>mail</title>
                <desc>Created with Sketch Beta.</desc>
                <defs> </defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
                    sketch:type="MSPage">
                    <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                        transform="translate(-414.000000, -261.000000)" fill="#000000">
                        <path
                            d="M430,275.916 L426.684,273.167 L415.115,285.01 L444.591,285.01 L433.235,273.147 L430,275.916 L430,275.916 Z M434.89,271.89 L445.892,283.329 C445.955,283.107 446,282.877 446,282.634 L446,262.862 L434.89,271.89 L434.89,271.89 Z M414,262.816 L414,282.634 C414,282.877 414.045,283.107 414.108,283.329 L425.147,271.927 L414,262.816 L414,262.816 Z M445,261 L415,261 L430,273.019 L445,261 L445,261 Z"
                            id="mail" sketch:type="MSShapeGroup"> </path>
                    </g>
                </g>
            </g>
        </svg> ${data.email}</li>`;
        }
        if (data.phone) {
            contactHtml += `<li><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
            <path
                d="M 14 3.9902344 C 8.4886661 3.9902344 4 8.4789008 4 13.990234 L 4 35.990234 C 4 41.501568 8.4886661 45.990234 14 45.990234 L 36 45.990234 C 41.511334 45.990234 46 41.501568 46 35.990234 L 46 13.990234 C 46 8.4789008 41.511334 3.9902344 36 3.9902344 L 14 3.9902344 z M 18.005859 12.033203 C 18.633859 12.060203 19.210594 12.414031 19.558594 12.957031 C 19.954594 13.575031 20.569141 14.534156 21.369141 15.785156 C 22.099141 16.926156 22.150047 18.399844 21.498047 19.589844 L 20.033203 21.673828 C 19.637203 22.237828 19.558219 22.959703 19.824219 23.595703 C 20.238219 24.585703 21.040797 26.107203 22.466797 27.533203 C 23.892797 28.959203 25.414297 29.761781 26.404297 30.175781 C 27.040297 30.441781 27.762172 30.362797 28.326172 29.966797 L 30.410156 28.501953 C 31.600156 27.849953 33.073844 27.901859 34.214844 28.630859 C 35.465844 29.430859 36.424969 30.045406 37.042969 30.441406 C 37.585969 30.789406 37.939797 31.366141 37.966797 31.994141 C 38.120797 35.558141 35.359641 37.001953 34.556641 37.001953 C 34.000641 37.001953 27.316344 37.761656 19.777344 30.222656 C 12.238344 22.683656 12.998047 15.999359 12.998047 15.443359 C 12.998047 14.640359 14.441859 11.879203 18.005859 12.033203 z">
            </path>
        </svg> ${data.phone}</li>`;
        }
        if (data.linkedin) {
            contactHtml += `<li><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 50 50">
            <path
                d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z">
            </path>
        </svg> ${data.linkedin}</li>`;
        }
        if (data.location) {
            contactHtml += `<li><svg width="30px" height="30px" viewBox="-4 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
            fill="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <title>location</title>
                <desc>Created with Sketch Beta.</desc>
                <defs> </defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
                    sketch:type="MSPage">
                    <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                        transform="translate(-106.000000, -413.000000)" fill="#000000">
                        <path
                            d="M118,422 C116.343,422 115,423.343 115,425 C115,426.657 116.343,428 118,428 C119.657,428 121,426.657 121,425 C121,423.343 119.657,422 118,422 L118,422 Z M118,430 C115.239,430 113,427.762 113,425 C113,422.238 115.239,420 118,420 C120.761,420 123,422.238 123,425 C123,427.762 120.761,430 118,430 L118,430 Z M118,413 C111.373,413 106,418.373 106,425 C106,430.018 116.005,445.011 118,445 C119.964,445.011 130,429.95 130,425 C130,418.373 124.627,413 118,413 L118,413 Z"
                            id="location" sketch:type="MSShapeGroup"> </path>
                    </g>
                </g>
            </g>
        </svg> ${data.location}</li>`;
        }
        if (data.github) {
            contactHtml += `<li><svg width="30px" height="30px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <title>github [#142]</title>
                <desc>Created with Sketch.</desc>
                <defs> </defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)"
                        fill="#000000">
                        <g id="icons" transform="translate(56.000000, 160.000000)">
                            <path
                                d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
                                id="github-[#142]"> </path>
                        </g>
                    </g>
                </g>
            </g>
        </svg> ${data.github}</li>`;
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
                        <span class="location"><svg width="30px" height="30px" viewBox="-4 0 32 32" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                        xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" fill="#000000">
                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                        <g id="SVGRepo_iconCarrier">
                            <title>location</title>
                            <desc>Created with Sketch Beta.</desc>
                            <defs> </defs>
                            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"
                                sketch:type="MSPage">
                                <g id="Icon-Set-Filled" sketch:type="MSLayerGroup"
                                    transform="translate(-106.000000, -413.000000)" fill="#000000">
                                    <path
                                        d="M118,422 C116.343,422 115,423.343 115,425 C115,426.657 116.343,428 118,428 C119.657,428 121,426.657 121,425 C121,423.343 119.657,422 118,422 L118,422 Z M118,430 C115.239,430 113,427.762 113,425 C113,422.238 115.239,420 118,420 C120.761,420 123,422.238 123,425 C123,427.762 120.761,430 118,430 L118,430 Z M118,413 C111.373,413 106,418.373 106,425 C106,430.018 116.005,445.011 118,445 C119.964,445.011 130,429.95 130,425 C130,418.373 124.627,413 118,413 L118,413 Z"
                                        id="location" sketch:type="MSShapeGroup"> </path>
                                </g>
                            </g>
                        </g>
                    </svg> ${exp.location}</span>
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

