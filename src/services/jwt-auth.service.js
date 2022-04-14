const jwt = require('jsonwebtoken');

class AuthService {
    JWT_SECRET = '';

    constructor() {
        this.JWT_SECRET = process.env.JWTSecret;
    }

    /**
     * Generate policy document request
     * @param effect
     * @param resource
     * @return PolicyDocument
     */
    getPolicyDocument = (effect, resource) => {
        return {
            Version: '2012-10-17', // default version
            Statement: [
                {
                    Action: 'execute-api:Invoke', // default action
                    Effect: effect,
                    Resource: resource
                }
            ]
        };
    };

    /**
     * Get token from event
     * @param event
     * @return string
     */
    #getToken = (event) => {
        if (!event.type || event.type !== 'TOKEN') {
            throw new Error('Expected "event.type" parameter to have value "TOKEN"');
        }

        const tokenString = event.authorizationToken;
        if (!tokenString) {
            throw new Error('Expected "event.authorizationToken" parameter to be set');
        }

        const match = tokenString.match(/^Bearer (.*)$/);
        if (!match || match.length < 2) {
            throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
        }
        return match[1];
    };

    /**
     * Authenticate Request Token
     * @param event
     * @return {Promise<*>}
     */
    authenticate = (event) => {
        const token = this.#getToken(event);
        const decoded = jwt.decode(token, { complete: true });

        if (!decoded) {
            throw new Error('invalid token');
        }
        const key = this.#getSigningKey();
        const verifiedDecodedData = jwt.verify(token, key);
        console.log('Authorized');
        return {
            principalId: '123',
            policyDocument: this.getPolicyDocument('Allow', '*'),
            context: {
                token
            }
        };
    };

    /**
     * Get signing key from auth0
     * @return string
     */
    #getSigningKey = () => {
        return this.JWT_SECRET;
    };
}

module.exports = { AuthService }