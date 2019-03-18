import Ember from 'ember';
import { computed } from '@ember/object';

export default Ember.Component.extend({
  //tagName: 'a',
  //attributeBindings: ['role'],
  //role: 'button',
  sortField: null,
  sortFieldText: null,
  currentSortField: null,
  currentSortDirection: null,

  faClass: computed('currentSortDirection', function() {
    return this.get('currentSortDirection') == 'ASC' ? 'fa-angle-down' : 'fa-angle-up';
  }),

  isCurrentSortField: computed('sortField', 'currentSortField', function() {
    return this.get('sortField') == this.get('currentSortField');
  }),

  actions: {
    onClick() {
      if (this.get('isCurrentSortField')) {
        this.get('onChangeSortDirection')(this.get('currentSortDirection') == 'ASC' ? 'DESC' : 'ASC');
      }
      else {
        this.get('onChangeSortDirection')('DESC');
        this.get('onChangeSortField')(this.get('sortField'));
      }
      return false;
    }
  }
});
