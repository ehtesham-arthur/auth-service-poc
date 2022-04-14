const { google } = require('googleapis');


class GoogleAuthService {

    defaultScope = [
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    constructor(config = {}) {
        this.clientId = process.env.GoogleClientId;
        this.clientSecret = process.env.GoogleClientSecret;
        this.redirectUrl = process.env.GoogleSSORedirectUrl;
        this.auth = this.#createConnection();
    }

    #getConnectionUrl(auth) {
        return auth.generateAuthUrl({
            access_type: 'offline',
            prompt: 'consent',
            scope: this.defaultScope
        });
    }

    #createConnection() {
        return new google.auth.OAuth2(
            this.clientId,
            this.clientSecret,
            this.redirectUrl
        );
    }

    getAuthSettings() {
        const url = this.#getConnectionUrl(this.auth);

        return {
            authUrl: url,
            callbackUrl: this.redirectUrl
        }
    }

    async verifyCode(code = '') {
        const data = await this.auth.getToken(code);
        const tokens = data.tokens;
        console.log('data', data);
        return {
            tokens: tokens,
        };
    }
}

module.exports = {
    GoogleAuthService
}