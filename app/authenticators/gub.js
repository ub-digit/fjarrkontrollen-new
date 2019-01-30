import Base from 'ember-simple-auth/authenticators/base';
import { Promise, resolve } from 'rsvp';
import ENV from '../config/environment';
import { inject } from '@ember/service';

import {
  isUnauthorizedError
} from 'ember-ajax/errors';

export default Base.extend({
  ajax: inject(),

  restore(data) {
    return new Promise((resolve, reject) => {
      this.get('ajax').request(
        `${ENV.APP.authenticationBaseURL}/${data.token}`
      ).then(() => {
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  },

  authenticate(credentials) {
    return new Promise((resolve, reject) => {
      this.get('ajax').post(ENV.APP.authenticationBaseURL, {
        data: {
          xkonto: credentials.identification,
          password: credentials.password
        }
      }).then(function(response_data) {
        const token = response_data.access_token;
        resolve({
          authenticated: true,
          token: token,
          userLocationId: response_data.user.location_id,
          username: response_data.user.xkonto,
          userid: response_data.user.id,
          name: response_data.user.name
        });
      }).catch(function(error) {
        if (isUnauthorizedError(error)) {
          // handle 401 errors here
          reject("Fel användarnamn eller lösenord");
        }
        else {
          reject(error);
        }
      });
    });
  },
  invalidate(data) {
    return resolve();
  }
});

/*
export var initialize = function(container) {
	container.register('authenticator:custom', CustomAuthenticator);
};

export default {
	name: 'authentication',
	before: 'simple-auth',
	initialize: initialize
};
*/
