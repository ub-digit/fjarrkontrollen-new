import Ember from 'ember';
import { inject } from '@ember/service';

import EmberObject from '@ember/object';
import BarcodeDataValidations from '../validations/barcode-data';

export default Ember.Controller.extend({
  session: inject('session'),

  BarcodeDataValidations,
  isShowingScanModal: false,
  isBarcodeFormSubmitting: false, //Hack
  barcodeError: null,

  actions: {
    logout() {
      this.get('session').invalidate();
    },
    showScanModal() {
      this.set('barcodeData', new EmberObject({ barcode: null }));
      this.set('isShowingScanModal', true);
      this.set('barcodeError', null);
    },
    scan(changeset) {
      return this.store.findRecord('order', changeset.get('barcode')).then((record) => {
        this.set('isShowingScanModal', false);
        this.transitionToRoute('admin.post', record.get('id'));
      }).catch((error) => {
        this.set('barcodeError', 'Ingen order med numret hittades');
      })
    },
  }
});
