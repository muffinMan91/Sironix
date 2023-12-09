
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
        //first upload the image
        // const form = document.getElementById('submit-documents');
        // const formData = new FormData(form);

        // const imageResponse = await axios.post(`/upload-image`, formData);
        // console.log("image response: ", imageResponse);
        console.log("somethjing");

        const pdfFile = document.getElementById('resumeUpload').files[0];
        const extractedText = await extractTextFromPdf(pdfFile);


        const websiteResponse = await axios.post('/generate-website', {
            resumeText: extractedText
        });


        //get the link to the website by doing a get request to the server
        const websiteLinkResponse = await axios.get('/get-link');
        //get the link from the response
        const websiteLink = websiteLinkResponse.data.link;

        // Display a link to the generated website
        const linkTag = document.createElement('a');
        linkTag.href = websiteLink;
        linkTag.textContent = 'View Generated Website';
        linkTag.target = '_blank';  // Opens in a new tab/window
        document.getElementById('generated-website').appendChild(linkTag);




    } catch (error) {
        console.error('Error:', error);
    }


}

document.getElementById('submit-documents').addEventListener('submit', handleSubmit);


