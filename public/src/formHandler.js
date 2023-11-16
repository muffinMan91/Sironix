

async function handleSubmit(event) {
    event.preventDefault();
    const jobDescription = document.getElementById('job-description').value;
    console.log("job description: ", jobDescription);

    try {
        console.log("get generated materials");
        // request for cover letter
        const coverLetterResponse = await axios.get('/generate-coverLetter', { params: { jobDescription } });
        // request for resume
        const resumeResponse = await axios.get('/generate-resume', { params: { jobDescription } });
        //request for website
        const websiteResponse = await axios.get('/generate-website', { params: { jobDescription } });

        console.log("responses recieved");



        // Display generated resume and cover letter
        document.getElementById('generated-coverLetter').innerHTML = coverLetterResponse.data.content;
        document.getElementById('generated-resume').innerHTML = resumeResponse.data.content;

        // Display a link to the generated website
        const link = document.createElement('a');
        link.href = websiteResponse.data.url;
        link.textContent = 'View Generated Website';
        link.target = '_blank';  // Opens in a new tab/window
        document.getElementById('generated-website').appendChild(link);


    } catch (error) {
        console.error('Error:', error);
    }

    try {

    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('job-description-form').addEventListener('submit', handleSubmit);


