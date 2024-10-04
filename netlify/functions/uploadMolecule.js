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

        // Handle case where GPT sends file data as JSON
        if (contentType === 'application/json') {
            // Log the full JSON body to debug the structure
            console.log('Received JSON Body:', event.body);

            const parsedBody = JSON.parse(event.body);

            // Check if the 'file' field exists before accessing it
            if (!parsedBody.file) {
                console.error('No file field in the JSON body');
                return {
                    statusCode: 400,
                    body: 'Bad Request: No file field in JSON body',
                };
            }

            bodyData = parsedBody.file;
            console.log('Received JSON File Data Length:', bodyData.length);
        } else if (event.isBase64Encoded) {
            // Handle base64-encoded file content
            console.log('Decoding base64-encoded file data...');
            bodyData = Buffer.from(event.body, 'base64').toString('utf-8');
        } else {
            // Handle plain text file content
            bodyData = event.body;
            console.log('Received Plain Text File Data Length:', bodyData.length);
        }

        if (!bodyData || bodyData.length === 0) {
            console.error('No valid file data received');
            return {
                statusCode: 400,
                body: 'Bad Request: No valid file data received',
            };
        }

        // Return the decoded file data to the client
        return {
            statusCode: 200,
            body: bodyData,
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
