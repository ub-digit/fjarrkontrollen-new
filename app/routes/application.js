import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { inject } from '@ember/service';

export default Route.extend(ApplicationRouteMixin, {
  session: inject(),
  sessionAccount: inject('session-account'),

  routeAfterAuthentication: 'admin.index',
  routeIfAlreadyAuthenticated: 'admin.index',

  model() {
    return this._loadCurrentUser('restored');
  },

  sessionAuthenticated() {
    this._super(...arguments);
    this._loadCurrentUser('authenticated');
  },

  _loadCurrentUser(authenticatedOrRestored) {
    return this.get('sessionAccount')
      .loadCurrentUser(authenticatedOrRestored)
      .catch(() => this.get('session').invalidate());
  },

  actions: {
    loading(transition, originRoute) {
      let controller = this.controllerFor('application');
      controller.set('isLoading', true);
      transition.promise.finally(function() {
        controller.set('isLoading', false);
      });
    }
  }
});
