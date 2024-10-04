// netlify/functions/uploadMolecule.js
const fs = require('fs');
const multiparty = require('multiparty');

exports.handler = async (event, context) => {
    // Allow only POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    // Parse the incoming form data (multipart)
    const form = new multiparty.Form();
    let fileData = '';

    const data = await new Promise((resolve, reject) => {
        form.parse(event, function(err, fields, files) {
            if (err) return reject(err);
            const file = files.file[0];
            const filePath = file.path;

            // Read the uploaded file
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                fileData = data;
                resolve({ fileData });
            });
        });
    });

    // Return the molecule data (PDB/SDF)
    return {
        statusCode: 200,
        body: data.fileData, // Return the molecule file content
        headers: {
            'Content-Type': 'text/plain',
        },
    };
};
