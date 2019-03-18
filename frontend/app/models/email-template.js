import DS from 'ember-data';

export default DS.Model.extend({
  subjectSv: DS.attr('string'),
  subjectEn: DS.attr('string'),
  bodySv: DS.attr('string'),
  bodyEn: DS.attr('string')
});
