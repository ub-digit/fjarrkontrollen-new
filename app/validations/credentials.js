import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  identification: [
    validatePresence(true)
  ],
  password: [
    validatePresence(true)
  ]
};
