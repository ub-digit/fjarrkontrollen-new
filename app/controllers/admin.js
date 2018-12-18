import Ember from 'ember';
import { inject } from '@ember/service';

export default Ember.Controller.extend({
  session: inject('session'),

  actions: {
    logout() {
      this.get('session').invalidate();
    }
  }
});
