const multiparty = require('multiparty');
const fs = require('fs');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    // Parse the multipart form data
    const form = new multiparty.Form();
    let fileData = '';

    try {
        // Promise-based parsing of the form data
        const data = await new Promise((resolve, reject) => {
            form.parse(event, (err, fields, files) => {
                if (err) return reject(err);
                
                const file = files.file[0];
                const filePath = file.path;

                // Read the uploaded file content
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) return reject(err);
                    fileData = data;
                    resolve({ fileData });
                });
            });
        });

        // Return the file content (PDB or SDF)
        return {
            statusCode: 200,
            body: data.fileData,
            headers: {
                'Content-Type': 'text/plain',
            },
        };
    } catch (error) {
        console.error('Error processing file:', error);
        return {
            statusCode: 500,
            body: 'Internal Server Error',
        };
    }
};
