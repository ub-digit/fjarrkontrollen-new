import Ember from 'ember';
import { isEmpty, isBlank } from '@ember/utils';

export default Ember.Route.extend({
  queryParams: {
    locationId: {
      refreshModel: true
    },
    statusGroupLabel: {
      refreshModel: true
    },
    searchTermsDebounced: {
      refreshModel: true
    },
    orderTypeId: {
      refreshModel: true
    },
    deliverySourceLabel: {
      refreshModel: true
    },
    isArchivedOptionValue: {
      refreshModel: true
    },
    toBeInvoiced: {
      refreshModel: true
    },
    userId: {
      refreshModel: true
    },
    currentPage: {
      refreshModel: true
    },
    sortField: {
      refreshModel: true
    },
    sortDirection: {
      refreshModel: true
    },
  },

  model(params) {
    let filter = {};
    //TODO: Replace with mappings hash
    if (!isEmpty(params.locationId)) {
      filter['currentLocation'] = params.locationId;
    }
    if (!isEmpty(params.statusGroupLabel)) {
      filter['status_group'] = params.statusGroupLabel;
    }
    if (!isBlank(params.searchTermsDebounced)) {
      filter['search_term'] = params.searchTermsDebounced;
    }
    if (!isEmpty(params.orderTypeId)) {
      filter['mediaType'] = params.orderTypeId;
    }
    if (!isEmpty(params.deliverySourceLabel)) {
      filter['delivery_source'] = params.deliverySourceLabel;
    }
    if (!isEmpty(params.isArchivedOptionValue)) {
      filter['is_archived'] = params.isArchivedOptionValue;
    }
    if (!isEmpty(params.toBeInvoiced)) {
      filter['to_be_invoiced'] = params.toBeInvoiced;
    }
    if (!isEmpty(params.userId)) {
      filter['user'] = params.userId;
    }
    if (!isEmpty(params.currentPage)) {
      filter['page'] = params.currentPage;
    }
    if (!isEmpty(params.sortField)) {
      filter['sortfield'] = params.sortField;
    }
    if (!isEmpty(params.sortDirection)) {
      filter['sortdir'] = params.sortDirection;
    }
    return this.store.query('order', filter);
  },

  setupController(controller) {
    this._super(...arguments); // This sets model
    let optionModels = this.modelFor('admin');
    [
      'locations',
      'statusGroups',
      'statuses',
      'deliverySources',
      'orderTypes',
    ].forEach(function (property) {
      controller.set(property, optionModels[property]);
    });
    if (
        controller.get('sessionAccount.authenticatedOrRestored') == 'authenticated' &&
        controller.get('setDefaultLocation')
    ) {
      controller.set('locationId', controller.get('defaultLocationId'));
      controller.set('setDefaultLocation', false);
    }
  }
});
