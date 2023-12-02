
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
        const pdfFile = document.getElementById('resumeUpload').files[0];
        const extractedText = await extractTextFromPdf(pdfFile);


        const websiteResponse = await axios.post('/generate-website', {
            resumeText: extractedText
        });
        // Display a link to the generated website
        const websiteLink = document.createElement('a');
        websiteLink.href = websiteResponse.data.url;
        websiteLink.textContent = 'View Generated Website';
        websiteLink.target = '_blank';  // Opens in a new tab/window
        document.getElementById('generated-website').appendChild(websiteLink);




    } catch (error) {
        console.error('Error:', error);
    }


}

document.getElementById('submit-resume').addEventListener('submit', handleSubmit);


