import Ember from 'ember';
import RSVP from 'rsvp';
import { inject } from '@ember/service';


export default Ember.Route.extend({
  session: inject('session'),

  model(param) {
    let user_id = this.get('session.data.authenticated.userid');
    return RSVP.hash({
      order: this.store.findRecord('order', param.id),
      notes: this.store.query('note', {order_id: param.id}),
      locations: this.store.findAll('location'),
      statuses: this.store.findAll('status'), //Remove from index route since not used??
      deliverySources: this.store.findAll('delivery-source'),
      orderTypes: this.store.findAll('order-type'),
      message: this.store.createRecord('note', {isEmail: true, userId: user_id, orderId: param.id}),
      note: this.store.createRecord('note', {isEmail: false, userId: user_id, orderId: param.id}),
      emailTemplates: this.store.findAll('email-template'),
      users: this.store.findAll('user')
      /*
      statusGroups: this.store.findAll('status-group'),
      */
    });
  },

  /*
  afterModel(model) {
    model.get('emailTemplates').pushObject(
  },
  */

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
