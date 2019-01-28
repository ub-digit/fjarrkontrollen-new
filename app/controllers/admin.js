import Ember from 'ember';
import { inject } from '@ember/service';

export default Ember.Controller.extend({
  session: inject('session'),

  isShowingScanModal: false,

  actions: {
    logout() {
      this.get('session').invalidate();
    },
    scan() {
      this.set('isShowingScanModal', true);
    },
  }
});
