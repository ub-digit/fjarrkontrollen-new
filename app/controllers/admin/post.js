import Ember from 'ember';
import OrderValidations from '../../validations/order';
import { A } from '@ember/array';
import { observer } from '@ember/object';
//import { debounce } from '@ember/runloop';

export default Ember.Controller.extend({
  OrderValidations,

  isEditing: false,
  errors: null,
  message: null,
  showAllValidations: false,

  messageObserver: observer('message', function() {
    debounce(this, () => {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.set('message', null);
      }
    }, 3000);
  }),

  /*
  init() {
    this._super(...arguments);
    //this.set('messages', A());
  }
  */

  actions: {
    saveOrder(changeset) {
      changeset.save().then(() => {
        this.set('message', 'Post sparad');
        this.set('isEditing', false);
      }).catch((error) => {
        console.dir(error);
      });
      console.log('save order');
    },
    orderInvalid(changeset) {
      //TODO: translation of prop, lookup with i18n
      //and create custom validation message
      this.set('errors', changeset.get('errors').map((error) => {
        return error['validation'];
      }));
    },
    editOrder(changeset) {
      this.set('showAllValidations', false);
      this.set('isEditing', true);
    },
    cancelEditOrder(changeset) {
      this.set('isEditing', false);
      this.set('errors', null);
      changeset.rollback();
    }
  }

});
