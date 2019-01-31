import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import RSVP from 'rsvp';

export default Ember.Route.extend(AuthenticatedRouteMixin, {
  authenticationRoute: 'login',

  //status group vs statuses differance?
  model() {
    return RSVP.hash({
      locations: this.store.findAll('location'),
      statusGroups: this.store.findAll('status-group'),
      orderTypes: this.store.findAll('order-type'),
      deliverySources: this.store.findAll('delivery-source'),

      //Used by order page only
      users: this.store.findAll('user'),
      emailTemplates: this.store.findAll('email-template'),
      statuses: this.store.findAll('status'),
    });
  }
});
