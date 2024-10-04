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

        if (!contentType) {
            console.error('No Content-Type header found');
            return {
                statusCode: 400,
                body: 'Bad Request: No Content-Type header found',
            };
        }

        // If the content type is JSON, assume it's coming from GPT Action
        let bodyData;
        if (contentType === 'application/json') {
            const parsedBody = JSON.parse(event.body);
            bodyData = parsedBody.file;  // Assuming the file data is inside the JSON payload
            console.log('Received JSON File Data');
        } else {
            // Decode the base64 body for other content types (e.g., multipart/form-data)
            bodyData = Buffer.from(event.body, 'base64').toString('utf-8');
        }

        if (!bodyData) {
            console.error('Failed to decode the file data');
            return {
                statusCode: 400,
                body: 'Bad Request: Failed to decode the file data',
            };
        }

        // Log the content type and file data for debugging
        console.log('Content Type:', contentType);
        console.log('Received File Data Length:', bodyData.length);

        // Return the file data to the client
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
