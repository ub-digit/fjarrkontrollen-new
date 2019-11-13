import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  xkonto: DS.attr('string'),
  name: DS.attr('string'),
  managingGroupId: DS.attr('string'),
  pickupLocationId: DS.attr('string'),
});
