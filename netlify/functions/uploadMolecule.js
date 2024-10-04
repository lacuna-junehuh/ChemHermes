exports.handler = async (event) => {
    try {
        // Ensure it's a POST request
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: 'Method Not Allowed',
            };
        }

        const contentType = event.headers['content-type'];
        console.log('Content Type:', contentType);

        let bodyData;
        let selectedStyle = 'cartoon'; // Default style if none provided

        // Handle case where GPT sends file data as JSON (with file_content and style fields)
        if (contentType === 'application/json') {
            console.log('Received JSON Body:', event.body);

            const parsedBody = JSON.parse(event.body);

            // Check if 'file_content' exists and extract it, otherwise fallback to other handling
            if (parsedBody.file_content) {
                bodyData = parsedBody.file_content;
                console.log('Received file_content data length:', bodyData.length);
            } else {
                console.error('No file_content field in the JSON body');
                return {
                    statusCode: 400,
                    body: 'Bad Request: No file_content field in JSON body',
                };
            }

            // Extract style if provided
            if (parsedBody.style) {
                selectedStyle = parsedBody.style;
                console.log('Selected Style:', selectedStyle);
            }

        } else if (event.isBase64Encoded) {
            // Handle base64-encoded file content
            console.log('Decoding base64-encoded file data...');
            bodyData = Buffer.from(event.body, 'base64').toString('utf-8');

        } else {
            // Handle plain text file content (expected case)
            bodyData = event.body;
            console.log('Received plain text file data length:', bodyData.length);
        }

        // Check if we have valid file data
        if (!bodyData || bodyData.length === 0) {
            console.error('No valid file data received');
            return {
                statusCode: 400,
                body: 'Bad Request: No valid file data received. Ensure the PDB content is correctly uploaded.',
            };
        }

        // Return the decoded file data along with the style to the client
        return {
            statusCode: 200,
            body: JSON.stringify({
                fileContent: bodyData,
                style: selectedStyle,
            }),
            headers: {
                'Content-Type': 'application/json',
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
