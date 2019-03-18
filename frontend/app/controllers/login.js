import Ember from 'ember';
import { inject } from '@ember/service';
export default Ember.Controller.extend({
  session: inject(),
  hasServerErrors: false,

  actions: {
    resetServerErrors(changeset) {
      if (this.get('hasServerErrors')) {
        changeset.validate();
        this.set('hasServerErrors', false);
      }
    },
    authenticate(changeset) {
      return this.get('session')
        .authenticate('authenticator:gub', {
          identification: changeset.get('identification'),
          password: changeset.get('password')
        })
        .catch((error) => {
          this.set('hasServerErrors', true);
          changeset.pushErrors('identification', '');
          if(typeof error === 'string') {
            changeset.pushErrors('password', error);
          }
          else {
            changeset.pushErrors('password', "Någonting gick fel, det går eventuellt för närvarande inte att logga in");
            console.dir(error);
          }
        });
    }
  }
});
