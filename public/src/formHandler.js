

async function handleSubmit(event) {
    event.preventDefault();
    const jobDescription = document.getElementById('job-description').value;

    try {
        // Send job description to server
        const materialsResponse = await axios.post('/generate-materials', { jobDescription });

        // Display generated resume and cover letter
        document.getElementById('generated-content').innerHTML = materialsResponse.data.content;

        // Now, generate the website
        const websiteResponse = await axios.post('/generate-website');
        const response = await axios.post('/generate-website');
        // Display a link to the generated website
        const link = document.createElement('a');
        link.href = response.data.url;
        link.textContent = 'View Generated Website';
        link.target = '_blank';  // Opens in a new tab/window
        document.getElementById('link-container').appendChild(link);


    } catch (error) {
        console.error('Error:', error);
    }

    try {

    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('job-description-form').addEventListener('submit', handleSubmit);


document.getElementById('job-description-form').addEventListener('submit', handleSubmit);
