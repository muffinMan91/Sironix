
// function to extract text from pdf
async function extractTextFromPdf(pdfFile) {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
        fileReader.onload = async (event) => {
            const typedArray = new Uint8Array(event.target.result);

            const loadingTask = pdfjsLib.getDocument(typedArray);
            const pdf = await loadingTask.promise;

            let textContent = '';

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const text = await page.getTextContent();
                textContent += text.items.map(item => item.str).join(' ');
            }

            resolve(textContent);
        };

        fileReader.onerror = (event) => {
            reject(event.target.error);
        };

        fileReader.readAsArrayBuffer(pdfFile);
    });
}

// function to handle form submission
async function handleSubmit(event) {
    event.preventDefault();


    try {


        //get the text from the pdf
        const pdfFile = document.getElementById('resumeUpload').files[0];
        const extractedText = await extractTextFromPdf(pdfFile);

        //generate the title of the website
        const websiteTitleResponse = await axios.post('/generate-Title', {
            resumeText: extractedText
        });

        // //generate the subtitle of the website
        // const websiteSubtitleResponse = await axios.post('/generate-Subtitle', {
        //     resumeText: extractedText
        // });
        // //generate the school summary of the website
        // const websiteSchoolSummaryResponse = await axios.post('/generate-SchoolSummary', {
        //     resumeText: extractedText
        // });
        // //generate the school details of the website
        // const websiteSchoolDetailsResponse = await axios.post('/generate-SchoolDetails', {
        //     resumeText: extractedText
        // });
        // //generate the experiences of the website
        // const websiteExperiencesResponse = await axios.post('/generate-Experiences', {
        //     resumeText: extractedText
        // });
        // //generate the experience1 of the website
        // const websiteExperience1Response = await axios.post('/generate-Experience1', {
        //     resumeText: extractedText
        // });
        // //generate the experience2 of the website
        // const websiteExperience2Response = await axios.post('/generate-Experience2', {
        //     resumeText: extractedText
        // });
        // //generate the experience3 of the website
        // const websiteExperience3Response = await axios.post('/generate-Experience3', {
        //     resumeText: extractedText
        // });
        // //generate the contact of the website
        // const websiteContactResponse = await axios.post('/generate-Contact', {
        //     resumeText: extractedText
        // });


        // get the image file to send to the server
        const form = document.getElementById('submit-documents');
        const formData = new FormData(form);
        //upload the image and the resume to cloudinary
        const uploadResponse = await axios.post(`/upload-documents`, formData);
        // console.log("upload response: ",uploadResponse);


        console.log("generating link");
        //get the link to the website
        const websiteLinkResponse = await axios.get('/get-link');
        const websiteLink = websiteLinkResponse.data.link;
        // Display a link to the generated website
        const linkTag = document.createElement('a');
        linkTag.href = websiteLink;
        //concatenate the link to the text content

        linkTag.textContent = websiteLink;
        linkTag.target = '_blank';  // Opens in a new tab/window
        const linkContainer = document.getElementById('generated-website-div');
        linkContainer.innerHTML = 'here is the permenant link to your website: <br> <br>';
        linkContainer.appendChild(linkTag);




    } catch (error) {
        console.error('Error:', error);
    }


}

document.getElementById('submit-documents').addEventListener('submit', handleSubmit);


