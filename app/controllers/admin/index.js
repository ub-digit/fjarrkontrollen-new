import Ember from 'ember';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default Ember.Controller.extend({
  queryParams: {
    locationId: 'location',
    statusGroupLabel: 'statusGroup',
    orderTypeId: 'orderType',
    deliverySourceId: 'deliverySource'
  },

  locationId: null,
  //statusId: null, ???
  statusGroupLabel: null,
  orderTypeId: null,
  deliverySourceId: null,

  location: computed('locationId', function() {
    return this.get('locationId')
      ? this.get('locations').findBy('id', this.get('locationId'))
      : null;
  }),
  statusGroup: computed('statusGroupLabel', function() {
    return this.get('statusGroupLabel')
      ? this.get('statusGroups').findBy('label', this.get('statusGroupLabel'))
      : null;
  }),
  orderType: computed('orderTypeId', function() {
    return this.get('orderTypeId')
      ? this.get('orderTypes').findBy('id', this.get('orderTypeId'))
      : null;
  }),
  deliverySource: computed('deliverySourceId', function() {
    return this.get('deliverySourceId')
      ? this.get('deliverySources').findBy('id', this.get('deliverySourceId'))
      : null;
  }),

  ordersFilter: computed(
    'locationId',
    'statusGroupLabel',
    'orderTypeId',
    'deliverySourceId', function() {
      let filter = {};

      if(this.get('locationId')) {
        filter['currentLocation'] = this.get('locationId');
      }
      if(this.get('statusGroupLabel')) {
        filter['status_group'] = this.get('statusGroup.label');
      }
      if(this.get('orderTypeId')) {
        filter['mediaType'] = this.get('orderTypeId');
      }
      if(this.get('locationId')) {
        //filter['currentLocation'] = this.get('locationId');
      }
      return Object.keys(filter).length !== 0 ? filter : null;
    }
  ),

  filteredOrders: computed('ordersFilter', function() {
    return isEmpty(this.get('ordersFilter'))
      ? this.get('orders')
      : this.store.query('order', this.get('ordersFilter'));
  }),

  actions: {
    filterOrders() {
      console.log('Filter orders');
    },
    resetOrderFilters() {
      console.log('reset order filters');
    },
    changeLocation(location) {
      this.set('locationId', location.get('id'));
    },
    changeStatusGroup(statusGroup) {
      this.set('statusGroupLabel', statusGroup.get('label'));
    },
    changeOrderType(orderType) {
      this.set('orderTypeId', orderType.get('id'));
    },
    changeDeliverySource(deliverySource) {
      this.set('deliverySourceId', deliverySource.get('id'));
    },
    /* expandOrderFilters() ? */
  }
});
