

async function handleSubmit(event) {
    event.preventDefault();
    const jobDescription = document.getElementById('job-description').value;
    console.log("job description: ", jobDescription);

    try {
        console.log("get generated materials");
        // // request for cover letter and display
        // const coverLetterResponse = await axios.get('/generate-coverLetter', { params: { jobDescription } });
        // document.getElementById('generated-coverLetter').innerHTML = coverLetterResponse.data;
        // request for resume html
        const resumeResponse = await axios.get('/generate-resume', { params: { jobDescription } });
        // Display a link to the generated resume
        const resumeLink = document.createElement('a');
        resumeLink.href = resumeResponse.data.url;
        resumeLink.textContent = 'View Generated resume';
        resumeLink.target = '_blank';  // Opens in a new tab/window
        document.getElementById('generated-resume').appendChild(resumeLink);
        //request for website html
        const websiteResponse = await axios.get('/generate-website', { params: { jobDescription } });
        // Display a link to the generated website
        const websiteLink = document.createElement('a');
        websiteLink.href = websiteResponse.data.url;
        websiteLink.textContent = 'View Generated Website';
        websiteLink.target = '_blank';  // Opens in a new tab/window
        document.getElementById('generated-website').appendChild(websiteLink);


        console.log("responses recieved");



    } catch (error) {
        console.error('Error:', error);
    }

    try {

    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('job-description-form').addEventListener('submit', handleSubmit);


