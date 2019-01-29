import Ember from 'ember';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { A } from '@ember/array';
import { inject } from '@ember/service';
import { debounce } from '@ember/runloop';
import ObjectProxy from '@ember/object/proxy';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { observer } from '@ember/object';
//import { task } from 'ember-concurrency';
import powerSelectOverlayedOptions from '../../mixins/power-select-overlayed-options'

const ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);

export default Ember.Controller.extend(powerSelectOverlayedOptions, {
  session: inject(),

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
    'sortField',
    'sortDirection',
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
      if(!isEmpty(this.get('sortField'))) {
        filter['sortfield'] = this.get('sortField');
      }
      if(!isEmpty(this.get('sortDirection'))) {
        filter['sortdir'] = this.get('sortDirection');
      }
      return filter;
    }
  ),

  ordersFilterChanged: observer('ordersFilter', function() {
    // Reset pagination
    this.set('currentPage', null);
  }),

  filteredOrders: computed(
    'ordersFilter',
    'currentPage', function() {
      let filter = this.get('ordersFilter');
      if(!isEmpty(this.get('currentPage'))) {
        filter['page'] = this.get('currentPage');
      }
      let proxy = ObjectPromiseProxy.create({
        promise: this.store.query('order', filter)
      });
      return proxy;
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
