import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      locations: this.store.findAll('location'),
      statuses: this.store.findAll('status'),
      statusGroups: this.store.findAll('status-group'),
      users: this.store.findAll('user'), // Why do we need this????
      orderTypes: this.store.findAll('order-type'),
      emailTemplates: this.store.findAll('email-template'),
      deliverySources: this.store.findAll('delivery-source'),
      orders: this.store.findAll('order')
    });
  },

  setupController(controller, model) {
    controller.setProperties(model);
  }
});
