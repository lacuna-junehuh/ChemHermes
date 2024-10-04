exports.handler = async (event) => {
    try {
        // Check if the method is POST
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: 'Method Not Allowed',
            };
        }

        const contentType = event.headers['content-type'];
        console.log('Content Type:', contentType);

        let bodyData;

        // Handle JSON input if sent from GPT Action
        if (contentType === 'application/json') {
            const parsedBody = JSON.parse(event.body);
            bodyData = parsedBody.file;  // Assume the file content is inside the 'file' field in JSON
            console.log('Received JSON File Data Length:', bodyData.length);
        } else if (event.isBase64Encoded) {
            // Decode base64-encoded content if sent as plain text
            console.log('Decoding base64-encoded file data...');
            bodyData = Buffer.from(event.body, 'base64').toString('utf-8');
        } else {
            bodyData = event.body;  // Handle raw plain text content
        }

        if (!bodyData || bodyData.length === 0) {
            console.error('Failed to receive or decode file data');
            return {
                statusCode: 400,
                body: 'Bad Request: No file data received',
            };
        }

        // Log file data for debugging
        console.log('Received File Data Length:', bodyData.length);

        // Return the decoded file data to the client
        return {
            statusCode: 200,
            body: bodyData,  // Send back the molecule data
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
