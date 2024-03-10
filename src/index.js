let ProxiedMailApi = require('proxiedmail-api');

function register(Cypress) {
    Cypress.Commands.add('proxiedmail', ((config) => {
        const apiKey = config?.apiKey ?? Cypress.env('PROXIEDMAIL_API_KEY');
        if (!apiKey) {
            throw new Error(
                'Error no ProxiedMail API Key. Please either pass the ProxiedMail command a valid Config object' +
                ' or set the environment variable CYPRESS_PROXIEDMAIL_API_KEY ' +
                'environment variable to the value of your ProxiedMail API Key to use the ProxiedMail Cypress plugin.'
                + ' Create a free account at https://proxiedmail.com/en/singup'
            );
        }
        const proxiedmail = new ProxiedMailApi.ApiClientFacade(apiKey);
        return Promise.resolve(proxiedmail);
    }));
}

register(Cypress);
