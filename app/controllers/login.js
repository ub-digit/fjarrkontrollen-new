import Ember from 'ember';
import { inject } from '@ember/service';
export default Ember.Controller.extend({
  session: inject(),

  actions: {
    // TODO: This function needs to take params, "method" etc? for password/github/facebook etc
    authenticate(changeset) {
      // TODO: validate??
      this.get('session')
        .authenticate('authenticator:gub', {
          identification: changeset.get('identification'),
          password: changeset.get('password')
        })
        .catch((reason) => {
          // TODO: render in template
          this.set('errorMessage', reason.error);
        });
    }
  }
});
