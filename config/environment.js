/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'fjarrkontrollen',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  ENV['simple-auth'] = {
    authorizer: 'authorizer:gub',
    //crossOriginWhitelist: ['http://localhost:4000/'],
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.APP.serviceURL = 'http://localhost:3000';
    ENV.contentSecurityPolicyHeader = 'Disabled-Content-Security-Policy';
    ENV.APP.authenticationBaseURL = 'http://localhost:3000/session';
  }
  else if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';
    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }
  else if (environment === 'production') {
    ENV.APP.serviceURL = 'https://fjarrkontrollen-server.ub.gu.se';
    ENV.APP.authenticationBaseURL = 'https://fjarrkontrollen-server.ub.gu.se/session';
  }
  else if (environment === 'staging') {
    ENV.APP.serviceURL = 'https://fjarrkontrollen-server-staging.ub.gu.se';
    ENV.APP.authenticationBaseURL = 'https://fjarrkontrollen-server-staging.ub.gu.se/session';
  }
  else if (environment === 'lab') {
    ENV.APP.serviceURL = 'https://fjarrkontrollen-server-lab.ub.gu.se';
    ENV.APP.authenticationBaseURL = 'https://fjarrkontrollen-server-lab.ub.gu.se/session';
  }

  return ENV;
};
