exports.handler = async (event) => {
    try {
        // Check if the method is POST
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                body: 'Method Not Allowed',
            };
        }

        // Netlify provides the file content as base64-encoded data in `event.body`
        const contentType = event.headers['content-type'];

        // Decode the base64 body if it's a file upload
        const bodyData = Buffer.from(event.body, 'base64').toString('utf-8');

        // Log the content type and file data for debugging
        console.log('Content Type:', contentType);
        console.log('Received File Data:', bodyData);

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
