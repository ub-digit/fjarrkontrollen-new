import Ember from 'ember';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { isArray } from '@ember/array';

export default Ember.Controller.extend({
  session: inject(),
  toast: inject(),

  isShowingScanModal: false,
  isShowingSetDeliveredScanModal: false,
  loggedInUser: null,

  affiliation: computed('session', 'loggedInUser.{managingGroupId,pickupLocationId}', function() {
    let currentUserId = this.get('session.data.authenticated.userid'); 
    let currentUser = this.store.peekRecord('user', currentUserId);
    if (currentUser.managingGroupId) {
      return " | Handläggningsgrupp: " + this.get('managingGroups').findBy('id', currentUser.managingGroupId.toString()).name;
    }
    else {
      if (currentUser.pickupLocationId) {
        return " | Avhämtningsbibliotek: " + this.get('pickupLocations').findBy('id', currentUser.pickupLocationId.toString()).nameSv;
      }
      else {
        return "";
      }
    }
    this.set("loggedInUser", null);
  }),

  userList: computed(function() {
    this.store.findAll('user');
  }),

  activeUserSirName: computed('loggedInUser.name', function() {
    let currentUserId = this.get('session.data.authenticated.userid'); 
    let currentUser = this.store.peekRecord('user', currentUserId);
    this.set("loggedInUser", null);
    return currentUser.name;
  }),

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

    scan(changeset) {
      return this.findOrderPromise(changeset.get('barcode')).then((order) => {
        this.set('isShowingScanModal', false);
        this.transitionToRoute('admin.post', order.get('id'));
      });
    },

    scanDelivered(changeset) {
      return this.findOrderPromise(changeset.get('barcode')).then((order) => {
        return order.setDelivered().then(() => {
          this.get('toast').success(
            `Order status ändrad till levererad för order <b>${changeset.get('barcode')}</b>.`,
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
