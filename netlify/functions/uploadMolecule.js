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
        console.log('Content Type:', contentType);  // Log content type for debugging

        // Handle base64-encoded content
        let bodyData;
        if (event.isBase64Encoded) {
            console.log('Decoding base64-encoded data...');
            bodyData = Buffer.from(event.body, 'base64').toString('utf-8');
        } else {
            bodyData = event.body;  // Handle non-base64 content as plain text
        }

        if (!bodyData || bodyData.length === 0) {
            console.error('No file data received or empty data');
            return {
                statusCode: 400,
                body: 'Bad Request: No file data received or file data is empty',
            };
        }

        console.log('Received File Data Length:', bodyData.length);

        // Return the decoded file data to the client
        return {
            statusCode: 200,
            body: bodyData,  // Return file content back to the client
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
