import Ember from 'ember';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from "../../mixins/reset-scroll";

export default Ember.Route.extend(ResetScroll, {
  session: inject('session'),

  model(param) {
    return RSVP.hash({
      order: this.store.findRecord('order', param.id),
      notes: this.store.query('note', { order_id: param.id }),
    });
  },

  setupController(controller, model) {
    let optionModels = this.modelFor('admin');
    [
      'managingGroups',
      'pickupLocations',
      'statuses',
      'deliverySources',
      'deliveryMethods',
      'orderTypes',
      'emailTemplates',
      'users',
      'customerTypes'
    ].forEach(function (property) {
      controller.set(property, optionModels[property]);
    });
    controller.setProperties(model);
    this.controllerFor('admin.index').set('lastOrderViewed', model.order.get('id'));
  }
});
