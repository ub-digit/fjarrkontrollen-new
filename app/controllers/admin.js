import Ember from 'ember';
import { inject } from '@ember/service';
import { isArray } from '@ember/array';
import RSVP from 'rsvp';

export default Ember.Controller.extend({
  session: inject(),
  toast: inject(),

  isShowingScanModal: false,
  isShowingSetRequestedScanModal: false,

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

    scanRequested(barcode) {
      return new RSVP.Promise((resolve, reject) => {
        this.findOrderPromise(barcode).then((order) => {
          let requestedStatus = this.get('statuses').findBy('nameSv', 'Beställd');
          order.set('statusId', requestedStatus.get('id'));
          order.save().then(() => {
            this.set('isShowingSetRequestedScanModal', false);
            this.get('toast').success(
              `Order status ändrad till beställd för order <b>${barcode}</b>.`,
              'Status ändrad'
            );
            resolve();
          }).catch((error) => {
            reject(error);
          });
        }).catch((error) => {
          reject(error);
        });
      });
    }
  }
});
