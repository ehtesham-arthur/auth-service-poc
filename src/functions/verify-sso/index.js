const jsonwebtoken = require("jsonwebtoken");
const { parseBody } = require("../../middlewares/parse-body");
const { GoogleAuthService } = require("../../services/google-auth.service");

/**
 * A simple example to check email if it exists in our environment then return auth and callback url
 */
exports.handler = async (event) => {
  try {
    console.info('received:', event);

    const body = parseBody(event);
    console.log('Body is ', body);

    if (!body.ssoType) {
      throw new Error('Invalid SSO type specified');
    }

    let jwtToken;
    if (body.ssoType === 'google') {
      if (!body.code) {
        throw new Error('An error occured while authenticating ERR[SSO-1]');
      }

      const authService = new GoogleAuthService();
      const tokens = await authService.verifyCode(body.code);

      jwtToken = jsonwebtoken.sign(tokens, process.env.JWTSecret, { expiresIn: '1d' });
    } else throw new Error('Sorry we are not integrated with this organization currently');

    const response = {
      statusCode: 400,
      body: JSON.stringify({ jwtToken })
    };
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
  } catch (error) {
    console.log(error);
    const response = {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
    return response;
  }

}
