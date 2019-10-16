import {
  validatePresence,
  validateNumber
} from 'ember-changeset-validations/validators';

export default {
  position: [
    validatePresence(true),
    validateNumber({ integer: true, positive: true })
  ],
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
  ]
};
