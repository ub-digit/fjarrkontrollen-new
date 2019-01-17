import {
  validatePresence
} from 'ember-changeset-validations/validators';

export default {
  //TODO: just test-conf, fix
  issue: [
    validatePresence(true)
  ],
  volume: [
    validatePresence(true)
  ]
};
