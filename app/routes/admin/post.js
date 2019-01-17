import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model(param) {
    return RSVP.hash({
      order: this.store.findRecord('order', param.id),
      notes: this.store.findAll('note', {order_id: param.id}),
      locations: this.store.findAll('location'),
      statuses: this.store.findAll('status'), //Remove from index route since not used??
      deliverySources: this.store.findAll('delivery-source'),
      orderTypes: this.store.findAll('order-type'),
      /*
      statusGroups: this.store.findAll('status-group'),
      users: this.store.findAll('user'), // Why do we need this????
      emailTemplates: this.store.findAll('email-template'),
      */
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
