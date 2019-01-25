import DS from 'ember-data';
import { not } from '@ember/object/computed';

export default DS.Model.extend({
  label: DS.attr('string'),
  name: DS.attr('string'),
  isActive: DS.attr('boolean'),
  isDisabled: not('isActive')
});
