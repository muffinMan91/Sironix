const fs = require('fs');
const path = require('path');

function fillTemplateWithData(data) {
    console.log("Filling template with data");

    // Load your HTML template
    const templatePath = path.join(__dirname, '..', '..', '..', 'public', 'PlainResume.html');
    let resumeHtml = fs.readFileSync(templatePath, 'utf8');

    // contact
    let contactHtml = data.contact ? data.contact.map(item => `<li>${item}</li>`).join('') : '';
    resumeHtml = resumeHtml.replace('<!-- contact -->', contactHtml);

    //profileSummary
    resumeHtml = resumeHtml.replace('<!-- profile summary -->', data.profileSummary);

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


    //awards and recognition
    let awardsHtml = data.awards.map((award, index) => {
        return (index > 0 ? '<hr>' : '') +
            `<h3><span>${award.title}</span> <span>${award.year}</span></h3>
            <p>${award.description}</p>`;
    }).join('');
    resumeHtml = resumeHtml.replace('<!-- awards/recognition -->', awardsHtml);

    // education and certifications
    let educationHtml = data.education.map((edu, index) => {
        return (index > 0 ? '<hr>' : '') +
            `<h3><span>${edu.title}</span> <span>${edu.period}</span></h3>
            <ul>` +
            edu.details.map(detail => `<li>${detail}</li>`).join('') +
            `</ul>`;
    }).join('');
    resumeHtml = resumeHtml.replace('<!-- education / certifications -->', educationHtml);


    //publications
    let publicationsHtml = `<ul>` +
        data.publications.map(pub => `<li>${pub}</li>`).join('') +
        `</ul>`;
    resumeHtml = resumeHtml.replace('<!-- publications -->', publicationsHtml);

    // skills/interests 
    let skillsInterestsHtml = `<ul>` +
        data.skillsInterests.map(skill => `<li>${skill}</li>`).join('') +
        `</ul>`;
    resumeHtml = resumeHtml.replace('<!-- skills/interests -->', skillsInterestsHtml);


    return resumeHtml;
}

const sampleData = {
    contact: [
        'example@example.com',
        '(123) 456-7890',
        'http://yourwebsite.com',
        'San Francisco, CA',
        'http://yourgithub.com',
        'Custom Link'
    ],
    profileSummary: 'Experienced Software Engineer with a passion for web development...',
    experiences: [
        {
            role: 'Senior Developer',
            company: 'Tech Company',
            period: 'Jan 2020 – Present',
            description: 'Responsible for leading the development of web applications...',
            bulletPoints: [
                'Developed a full-stack web application using React and Node.js',
                'Led a team of 5 developers in a successful project',
                'Implemented advanced features, resulting in a 30% increase in efficiency'
            ]
        }, {
            role: 'Full Stack Developer',
            company: 'Innovate Startup',
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
            title: 'B.S. in Computer Science',
            period: '2015 - 2019',
            details: [
                'Graduated with Honors',
                'Relevant Courses: Data Structures, Web Development, Machine Learning'
            ]
        },
        {
            title: 'Certification in Full Stack Web Development',
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
    skillsInterests: [
        'Web Development: HTML, CSS, JavaScript, React',
        'Languages: English, Spanish',
        'Exploring the Future of Web Technologies',
        'Efficient Database Design for Modern Web Applications'
    ]
};

// Generate and print the filled resume HTML
const filledResumeHtml = fillTemplateWithData(sampleData);
console.log(filledResumeHtml);


