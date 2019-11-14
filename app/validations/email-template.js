import {
  validatePresence,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  subjectSv: [
    validatePresence(true),
  ],
  subjectEn: [
    validatePresence(true),
  ],
  bodyEn: [
    validatePresence(true),
  ],
  bodySv: [
    validatePresence(true),
  ],
  position: [
    validatePresence(true),
    validateNumber({ integer: true, positive: true })
  ],
};
