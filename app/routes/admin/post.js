import Ember from 'ember';
import RSVP from 'rsvp';
import { inject } from '@ember/service';


export default Ember.Route.extend({
  session: inject('session'),

  model(param) {
    return RSVP.hash({
      order: this.store.findRecord('order', param.id),
      notes: this.store.query('note', { order_id: param.id }),
      locations: this.store.findAll('location'),
      statuses: this.store.findAll('status'), //Remove from index route since not used??
      deliverySources: this.store.findAll('delivery-source'),
      orderTypes: this.store.findAll('order-type'),
      emailTemplates: this.store.findAll('email-template'),
      users: this.store.findAll('user')
    });
  },

  /*
  afterModel(model) {
    model.get('emailTemplates').pushObject(
  },
  */

  setupController(controller, model) {
    controller.setProperties(model);
    this.controllerFor('admin.index').set('lastOrderViewed', model.order.get('id'));
  }
});
