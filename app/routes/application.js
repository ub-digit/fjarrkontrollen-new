import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Route.extend(ApplicationRouteMixin, {
  routeAfterAuthentication: 'admin.index',
  routeIfAlreadyAuthenticated: 'admin.index',

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
