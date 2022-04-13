/**
 * A simple example to check email if it exists in our environment then return auth and callback url
 */
exports.handler = async (event) => {
  try {
    console.info('received:', event);
    const response = {
        statusCode: 400,
        body: JSON.stringify({ error: true })
      };
    return response;
  } catch (error) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
    return response;
  }

}
