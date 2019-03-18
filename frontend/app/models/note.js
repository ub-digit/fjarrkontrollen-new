import DS from 'ember-data';

export default DS.Model.extend({
  //orderId: DS.belongsTo('order'),
  //userId: DS.belongsTo('user'),
  orderId: DS.attr('string'),
  userId: DS.attr('string'),
  subject: DS.attr('string'),
  message: DS.attr('string'),
  isEmail: DS.attr('boolean'),
  createdAt: DS.attr('date'),
  updatedAt: DS.attr('date')
});
