import Base from 'ember-simple-auth/authenticators/base';
import RSVP from 'rsvp';
import ENV from '../config/environment';
import { inject } from '@ember/service';

import {
  isAjaxError,
  isNotFoundError,
  isForbiddenError
} from 'ember-ajax/errors';

export default Base.extend({
  ajax: inject(),

  restore(data) {
    return new RSVP.Promise((resolve, reject) => {
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
    return new RSVP.Promise((resolve, reject) => {
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
        if (isNotFoundError(error)) {
          // handle 404 errors here
          reject("TODO");
        }
        else if (isForbiddenError(error)) {
          // handle 403 errors here
          reject("TODO");
        }
        else if (isAjaxError(error)) {
          // handle all other AjaxErrors here
          reject("TODO");
        }
        // other errors are handled elsewhere
        // TODO: Will be swallowed silenty?
        // or reject(error) ?? same??
        throw error;
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
