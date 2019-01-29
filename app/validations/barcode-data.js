import {
  validatePresence,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  barcode: [
    validatePresence(true),
    validateNumber({ integer: true, positive: true })
  ]
};
