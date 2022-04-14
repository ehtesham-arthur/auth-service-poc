const jsonwebtoken = require("jsonwebtoken");
const { GoogleAuthService } = require("../../../services/google-auth.service");

/**
 * A simple example to check email if it exists in our environment then return auth and callback url
 */
exports.handler = async (event) => {
  const callbackUrl = process.env.FrontEndRedirectUrl || '';
  try {
    console.info('recieved:', event);

    const { code = '' } = event.queryStringParameters;
    console.log('Code is', code);
    

    let jwtToken;
    if (!code) {
      throw new Error('An error occured while authenticating ERR[SSO-1]');
    }
    const authService = new GoogleAuthService();
    const tokens = await authService.verifyCode(code);

    jwtToken = jsonwebtoken.sign(tokens, process.env.JWTSecret, { expiresIn: '1d' });

    const response = {
      statusCode: 301,
      headers: {
        Location: `${callbackUrl}?jwtToken=${jwtToken}`
      }
    };
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
  } catch (error) {
    console.log(error);
    const response = {
      statusCode: 301,
      headers: {
        Location: `${callbackUrl}?error=${error.message}`
      }
    };
    return response;
  }

}
