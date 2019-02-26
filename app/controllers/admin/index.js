import Ember from 'ember';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { inject } from '@ember/service';
import { debounce } from '@ember/runloop';
import { observer } from '@ember/object';
//import { task } from 'ember-concurrency';
import powerSelectOverlayedOptions from '../../mixins/power-select-overlayed-options'
import { A } from '@ember/array';

export default Ember.Controller.extend(powerSelectOverlayedOptions, {
  sessionAccount: inject(),

  setDefaultLocation: true, //hack

  powerSelectOverlayedOptions: [{
    source: 'locations',
    target: 'locationOptions',
    valueProperty: 'id',
    labelProperty: 'nameSv',
    noneLabel: 'Alla bibliotek'
  }, {
    source: 'orderTypes',
    target: 'orderTypeOptions',
    valueProperty: 'id',
    labelProperty: 'nameSv',
    noneLabel: 'Alla beställningstyper'
  }, {
    source: 'deliverySources',
    target: 'deliverySourceOptions',
    valueProperty: 'label',
    labelProperty: 'name',
    noneLabel: 'Alla leveransställen'
  }],

  queryParams: {
    locationId: 'location',
    statusGroupLabel: 'status_group',
    searchTermsDebounced: 'search',
    orderTypeId: 'order_type',
    deliverySourceLabel: 'delivery_source',
    isArchivedOptionValue: 'is_archived',
    toBeInvoiced: 'to_be_invoiced',
    userId: 'user',
    currentPage: 'page',
    sortField: 'sort_field',
    sortDirection: 'sort_direction'
  },

  sortFields: {
    order_number: 'Ordernummer',
    name: 'Låntagare',
    order_type_id: 'Typ',
    title: 'Titel',
    status_id: 'Status',
  },

  filtersExpanded: null,

  defaultLocationId: computed('sessionAccount.userLocationId', function() {
    return this.get('sessionAccount.userLocationId').toString();
  }),

  /* Filters */
  locationId: null,
  statusGroupLabel: 'all',
  orderTypeId: null,
  deliverySourceLabel: null,
  isArchivedOptionValue: 'false',
  toBeInvoiced: null,
  userId: null,
  searchTermsDebounced: null,
  searchTerms: null,
  /* End filters */

  /* Pagination */
  currentPage: null,

  /* Sorting*/
  sortField: null,
  sortDirection: null,

  /*
  setOrderAssignedUserPromise(orderId, newUserId) {
    return new RSVP.Promise((resolve, reject) => {
      this.store.find('order', orderId).then(function(order) {
        order.set('userId', newUserId);
        //TODO: If error in then below, will propagate to parent catch???
        order.save().then(() => {
          resolve();
          //TODO: refresh model needed??
        }).catch((error) => {
          //TODO: error handling, ember concurrency way?
          console.log(error);
          reject(error);
        });
      });
    });
  },
  */

  init() {
    this._super(...arguments);
    this.set('searchTermsDebounced', this.get('searchTerms'));
    this.set('isArchivedOptions', A([{
      label: 'Visa bada aktiva och arkiverade',
      value: '',
    }, {
      label: 'Visa endast aktiva',
      value: 'false'
    }, {
      label: 'Visa endast arkiverade',
      value: 'true'
    }
    ]));
  },

  myOrdersFilterActive: computed('userId', function() {
    return !!this.get('userId');
  }),

  ordersFilterChanged: observer(
    'locationId',
    'statusGroupLabel',
    'searchTermsDebounced',
    'orderTypeId',
    'deliverySourceLabel',
    'isArchivedOptionValue',
    'toBeInvoiced',
    'userId',
    'sortField',
    'sortDirection', function() {
    // Reset pagination
    this.set('currentPage', null);
  }),

  setSearchTermsDebounced() {
    this.set('searchTermsDebounced', this.get('searchTerms'));
  },

  actions: {
    resetFilters() {
      [
        'orderTypeId',
        'deliverySourceLabel',
        'toBeInvoiced',
        'userId',
        'searchTermsDebounced',
        'searchTerms'
      ].forEach((filterKey) => {
        this.set(filterKey, null);
      });
      this.set('isArchivedOptionValue', 'false');
      this.set('statusGroupLabel', 'all');
      this.set('locationId', this.get('defaultLocationId'));
    },

    setToBeInvoiced(value) {
      this.set('toBeInvoiced', value ? true : null);
    },

    setMyOrders(value) {
      this.set('userId', value
        ? this.get('sessionAccount.userid')
        : null
      );
    },

    setSearchTerms(value) {
      this.set('searchTerms', value);
      debounce(this, 'setSearchTermsDebounced', 500);
    }
  }
});
