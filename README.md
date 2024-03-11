# ProxiedMail Cypress Plugin
Official ProxiedMail plugin for email testing with Cypress.
This library is using the base NodeJS library of [ProxiedMail](https://github.com/proxied-mail/proxiedmail-js-client)

## Features
- Create a new email address
- Receiving letters contents that was sent to generated emails
- Receiving subject, body, html, headers of email

## Example

In this example we're creating the email address and receiving the first mail.
Also, we're asserting that subject and body is correct.
```javascript
describe('template spec', () => {
  it('testing email', {
    defaultCommandTimeout: 10000,
  }, () => {

    cy.proxiedmail().then((proxiedmail) => {

      cy.visit('https://proxiedmail.com')
      cy.get('.nav_li').contains('Sign up').click()
      cy.url().should('include', '/en/signup')


      cy.then(
          () => {
            return new Promise(resolve => {
              proxiedmail.createProxyEmail(proxyEmail => {
                resolve(proxyEmail)
              })
            })
      }).then((proxyEmail)  => {
        cy.wrap(proxyEmail.getId()).as('proxyEmailId')
        cy.wrap(proxyEmail.getProxyEmail()).as('emailAddress')
      })


      Cypress.on('uncaught:exception', (err, runnable) => {
        // returning false here prevents Cypress from
        // failing the test
        return false
      })


      cy.then(function () {
        global.proxyEmailId = this.proxyEmailId
        cy.get('#login').type(this.emailAddress)
        cy.get('#password').type('123456')
        return cy.get('#proceed').click()
      })



      cy.then(() => {
        return new Promise(resolve => {
              const interval = setInterval(() => {
                proxiedmail.getReceivedEmails(global.proxyEmailId, (resp) => {
                  if (resp.data.length > 0) {
                    resp.data[0].getDetails(function (details) {
                      clearInterval(interval);
                      resolve(details)
                    })
                  }
              })}, 3000);
              return interval;
            })
          },
          {
            timeout: 10000
          }
      ).then(details => {
        expect(details.getSubject()).to.equal('Please confirm your email on ProxiedMail')
        expect(details.getPayloadBodyHtml()).to.have.string(
            'please confirm that you want to receive messages by clicking'
        );
      });
    });
  })
})
```

## Quick links

- [API Documentation](https://docs.proxiedmail.com)
- [ProxiedMail JS Client](https://github.com/proxied-mail/proxiedmail-js-client)
- [This client on npm](https://www.npmjs.com/package/cypress-test-email)
- [ProxiedMail](https://proxiedmail.com)

## Install

Ensure you have Cypress installed first then run:
```bash
npm install --save-dev cypress-test-email
```

Then include the plugin in your cypress/support/index.{js,ts} file.

```javascript
import 'cypress-test-email'
```

## Configuration

It's necessary to specify your API token in `PROXIEDMAIL_API_KEY`.

You can configure this plugin by putting to env variable `PROXIEDMAIL_API_KEY` to cypress.config.js

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
    "env": {
        "PROXIEDMAIL_API_KEY": "YOUR API KEY"
    },
    e2e: {
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
```

You can also pass the variable in a command line
```bash
PROXIEDMAIL_API_KEY=your-api-key cypress run
```

## Obtaining API key

You can obtain API key by signing up on [ProxiedMail](https://proxiedmail.com).
Basic usage of the product is free up to 10 mailboxes + some API limits.
If you want to get the best result please think about upgrading your account.

See pricing on [ProxiedMail](https://proxiedmail.com/en/pricing)


### Timeouts

ProxiedMail requires timeouts in order to get your emails.
Please adjust the timings where you have the email testings up to 10s (1000ms).

### Usage
The Cypress ProxiedMail plugin provide one simple command attached to the Cypress object: cy.proxiedmail().
This method returns a ProxiedMail client instance that has all the same methods and properties as the official ProxiedMail client. 
Use the command with the then() method to access the instance:
```javascript
describe('sign up using disposable email', function () {
    it('can set config', () => {
        //<gen>cy_config_dynamic
        cy.proxiedmail().then((proxiedmail) => {
            // use the proxiedmail instance
        });
    })
});
```

### Common methods

#### createProxyEmail
```javascript
        cy.then(
            () => {
                return new Promise(resolve => {
                    proxiedmail.createProxyEmail(proxyEmail => {
                        resolve(proxyEmail)
                    })
                })
    })
```

#### getReceivedEmails
```javascript
        cy.then(() => {
            return new Promise(resolve => {
                const interval = setInterval(() => {
                    proxiedmail.getReceivedEmails(global.proxyEmailId, (resp) => {
                        if (resp.data.length > 0) {
                            resp.data[0].getDetails(function (details) {
                                clearInterval(interval);
                                resolve(details)
                            })
                        }
                    })
                }, 3000);
                return interval;
            })
        },
        {
            timeout: 10000
        }
    ).then(details => {
        expect(details.getSubject()).to.equal('Please confirm your email on ProxiedMail')
        expect(details.getPayloadBodyHtml()).to.have.string(
            'please confirm that you want to receive messages by clicking'
        );
    });
```

## Help

If you have any questions or need help, please contact us on [ProxiedMail](https://proxiedmail.com) 
or you can use pmjshelp@pxdmail.com.

Good luck!
