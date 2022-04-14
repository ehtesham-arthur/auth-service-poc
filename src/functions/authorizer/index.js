const { AuthService } = require("../../services/jwt-auth.service");

/**
 * A custom authorizer for api gateway
 */
exports.handler = async (event, _context, callback) => {
  try {
    console.info('received:', event);
    const authService = new AuthService();
    return authService.authenticate(event);
  } catch (error) {
    console.log('error occurred is ', err);
    callback('Unauthorized'); // Return a 401 Unauthorized response
  }
}
