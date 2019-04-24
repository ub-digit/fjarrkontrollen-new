import Ember from 'ember';
import { inject } from '@ember/service';
import { isArray } from '@ember/array';

export default Ember.Controller.extend({
  session: inject(),
  toast: inject(),

  isShowingScanModal: false,
  isShowingSetDeliveredScanModal: false,

  findOrderPromise(barcode) {
    return this.store.findRecord('order', barcode).catch((error) => {
      if (
          isArray(error.errors) &&
          error.errors[0] &&
          error.errors[0].status == '404'
         ) {
        throw 'Ingen order med numret hittades';
      }
      else {
        throw error;
      }
    });
  },

  actions: {
    logout() {
      this.get('session').invalidate();
    },

    scan(barcode) {
      return this.findOrderPromise(barcode).then((order) => {
        this.set('isShowingScanModal', false);
        this.transitionToRoute('admin.post', order.get('id'));
      });
    },

    scanDelivered(barcode) {
      return this.findOrderPromise(barcode).then((order) => {
        return order.setDelivered().then((response) => {
          this.get('toast').success(
            `Order status ändrad till levererad för order <b>${barcode}</b>.`,
            'Status ändrad'
          );
        });
      }).catch((error) => {
        if (error.errors) {
          this.get('toast').warning(
            error.errors.message,
            error.errors.error
          );
        }
        else {
          throw error;
        }
      });
    }
  }
});
