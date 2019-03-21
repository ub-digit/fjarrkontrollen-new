import DS from 'ember-data';

export default DS.Model.extend({
  kohaSearchUrl: DS.attr('string'),
  librisillRequestUrl: DS.attr('string')
});
