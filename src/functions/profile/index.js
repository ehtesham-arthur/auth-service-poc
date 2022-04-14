/**
 * A simple endpoints
 */
exports.handler = async (event) => {
  try {
    console.info('received:', event);

    const response = {
      statusCode: 200,
      body: JSON.stringify({ authResult: event.requestContext.authorizer })
    };
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
  } catch (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
    return response;
  }

}
