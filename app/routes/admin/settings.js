import Ember from 'ember';
import RSVP from 'rsvp';
import { inject } from '@ember/service';
import ResetScroll from "../../mixins/reset-scroll";

export default Ember.Route.extend(ResetScroll, {
  session: inject('session'),

  model() {
    return this.store.findAll('email_template');
  }, 

  setupController(controller) {
   this._super(...arguments); // This sets model
  },

	actions: {
		refreshRoute: function() {
			this.refresh();
		}
	}
});
