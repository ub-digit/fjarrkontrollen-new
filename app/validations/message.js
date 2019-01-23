import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  subject: [
    validatePresence(true)
  ],
  message: [
    validatePresence(true)
  ]
};
