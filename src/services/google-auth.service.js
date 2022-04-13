const { google } = require('googleapis');


class GoogleAuthService {

    defaultScope = [
        'https://www.googleapis.com/auth/userinfo.email',
    ];

    constructor() {
        this.clientId = process.env.GoogleClientId;
        this.clientSecret = process.env.GoogleClientSecret;
        this.redirectUrl = process.env.FrontEndRedirectUrl;
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
// client_id = ''
// client_secret = ''
// const googleConfig = {
//     // clientId: '951990584600-v5t0at2vg50b071g6k93v9igb97avie0.apps.googleusercontent.com', // e.g. asdfghjkljhgfdsghjk.apps.googleusercontent.com
//     // clientSecret: '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', // e.g. _ASDFA%DFASDFASDFASD#FAD-
//     clientId: client_id,
//     clientSecret: client_secret,
//     redirect: 'https://google.com' // this must match your google api settings
// };

// /*************/
// /** HELPERS **/
// /*************/

// function getGooglePlusApi(auth) {
//     return google.plus({ version: 'v1', auth });
// }

// /**********/
// /** MAIN **/
// /**********/

// /**
//  * Part 1: Create a Google URL and send to the client to log in the user.
//  */
// function urlGoogle() {
//     const auth = createConnection();
//     const url = getConnectionUrl(auth);
//     return url;
// }

// /**
//  * Part 2: Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
//  */
// async function getGoogleAccountFromCode(code) {
//     const auth1 = createConnection();
//     const data = await auth1.getToken(code);
//     const tokens = data.tokens;
//     console.log('tokens', tokens);
//     const auth = createConnection();
//     auth.setCredentials(tokens);
//     // const plus = getGooglePlusApi(auth);
//     // const me = await plus.people.get({ userId: 'me' });
//     // const userGoogleId = me.data.id;
//     // const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
//     return ''
//     return {
//         id: userGoogleId,
//         email: userGoogleEmail,
//         tokens: tokens,
//     };
// }


// // url = urlGoogle()
// // console.log(url);

// // code = '4/0AX4XfWhyZ7ma9ghDW2FGUOua8QlVUCvp11LG7m-Yo-9HoweSKgOHG2MS79b0UrG-_bl3KA'
// // code = '4/0AX4XfWjT6pqroYK7vXwq0jKRT_4kq3ilYqIUEZVhh9MawRshT7rYGU6PlPbxDGixg4Jlgw'
// code = '4/0AX4XfWiRcvTvlQs_nUc6kvT-bb4T50Pt9SORcPyDxRMQ4ycmiNAHxWF4b_UhHXLe_-AY9Q'
// response = getGoogleAccountFromCode(code)
// console.log(response);