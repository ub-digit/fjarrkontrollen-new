import Ember from 'ember';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';
import { inject } from '@ember/service';
import { debounce } from '@ember/runloop';

export default Ember.Controller.extend({
  session: inject('session'),

  queryParams: {
    locationId: 'location',
    statusGroupLabel: 'statusGroup',
    searchTermsDebounced: 'search',
    orderTypeId: 'orderType',
    deliverySourceLabel: 'deliverySource',
    isArchivedOptionValue: 'isArchived',
    toBeInvoiced: 'toBeInvoiced',
    userId: 'user'
  },

  filtersExpanded: null,

  /* Filters */
  locationId: null,
  //statusId: null, ???
  statusGroupLabel: null,
  orderTypeId: null,
  deliverySourceLabel: null,
  isArchivedOptionValue: null,
  toBeInvoiced: null,
  userId: null,
  searchTermsDebounced: null,
  searchTerms: null,
  /* End filters */

  init() {
    this._super(...arguments);
    this.set('isArchivedOptions', A([{
      label: 'Visa bada aktiva och arkiverade',
      value: '',
    }, {
      label: 'Visa endast aktiva',
      value: 'true'
    }, {
      label: 'Visa endast arkiverade',
      value: 'false'
    }
    ]));
    this.set('searchTermsDebounced', this.get('searchTerms'));
  },

  myOrdersFilterActive: computed('userId', function() {
    return !!this.get('userId');
  }),

  ordersFilter: computed(
    'locationId',
    'statusGroupLabel',
    'searchTermsDebounced',
    'orderTypeId',
    'deliverySourceLabel',
    'isArchivedOptionValue',
    'toBeInvoiced',
    'userId',
    function() {
      let filter = {};

      if(!isEmpty(this.get('locationId'))) {
        filter['currentLocation'] = this.get('locationId');
      }
      if(!isEmpty(this.get('statusGroupLabel'))) {
        filter['status_group'] = this.get('statusGroupLabel');
      }
      if(!isEmpty(this.get('searchTermsDebounced'))) {
        filter['search_term'] = this.get('searchTermsDebounced');
      }
      if(!isEmpty(this.get('orderTypeId'))) {
        filter['mediaType'] = this.get('orderTypeId');
      }
      if(!isEmpty(this.get('deliverySourceLabel'))) {
        filter['delivery_source'] = this.get('deliverySourceLabel');
      }
      if(!isEmpty(this.get('isArchivedOptionValue'))) {
        filter['is_archived'] = this.get('isArchivedOptionValue');
      }
      if(!isEmpty(this.get('toBeInvoiced'))) {
        filter['to_be_invoiced'] = this.get('toBeInvoiced');
      }
      if(!isEmpty(this.get('userId'))) {
        filter['user'] = this.get('userId');
      }
      return Object.keys(filter).length !== 0 ? filter : null;
    }
  ),

  filteredOrders: computed('ordersFilter', function() {
    return isEmpty(this.get('ordersFilter'))
      ? this.get('orders')
      : this.store.query('order', this.get('ordersFilter'));
  }),

  setSearchTermsDebounced() {
    this.set('searchTermsDebounced', this.get('searchTerms'));
  },

  actions: {
    resetFilters() {
      [
        'locationId',
        'statusGroupLabel',
        'orderTypeId',
        'deliverySourceLabel',
        'isArchivedOptionValue',
        'toBeInvoiced',
        'userId',
        'searchTermsDebounced',
        'searchTerms'
      ].forEach((filterKey) => {
        this.set(filterKey, null);
      });
    },

    setToBeInvoiced(value) {
      this.set('toBeInvoiced', value ? true : null);
    },

    setMyOrders(value) {
      this.set('userId', value
        ? this.get('session.data.authenticated.userid')
        : null
      );
    },

    setSearchTerms(value) {
      this.set('searchTerms', value);
      debounce(this, 'setSearchTermsDebounced', 500);
    }
  }
});
