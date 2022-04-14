const { users, organizations } = require("../../db/constants");
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

    const { email = '' } = body;
    if (!email) {
      throw new Error('Invalid email specified');
    }

    const userData = users.find(user => user.email === email);
    if (!userData || !userData.organizationId) {
      throw new Error('Sorry your email is not registered with us');
    }

    const organizationData = organizations.find(organization => organization.organizationId === userData.organizationId);

    let authService;
    if (organizationData.sso.type === 'google') {
      authService = new GoogleAuthService();
    } else {
      throw new Error('Sorry we do not support this type of SSO');
    }

    const {authUrl, callbackUrl } = authService.getAuthSettings();

    const response = {
      statusCode: 200,
      body: JSON.stringify({ authUrl: authUrl, callbackUrl: callbackUrl, ssoType: organizationData.sso.type })
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
