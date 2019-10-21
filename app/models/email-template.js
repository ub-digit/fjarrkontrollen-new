import DS from 'ember-data';

export default DS.Model.extend({
  label: DS.attr('string'),
  subjectSv: DS.attr('string'),
  subjectEn: DS.attr('string'),
  bodySv: DS.attr('string'),
  bodyEn: DS.attr('string'),
  disabled: DS.attr('boolean'),
  position: DS.attr('number')
});
