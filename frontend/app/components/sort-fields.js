import Ember from 'ember';

export default Ember.Component.extend({

  sortFields: null,
  currentSortField: null,
  currentSortDirection: null,
  onChangeSortField: function() {},
  onChangeSortDirection: function() {},

  actions: {
    onChangeSortField() {
      this.get('onChangeSortField')(...arguments);
    },
    onChangeSortDirection() {
      this.get('onChangeSortDirection')(...arguments);
    },
  }

});
