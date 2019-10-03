import Ember from 'ember';
import OrderValidations from '../../validations/order';
import MessageValidations from '../../validations/message';
import NoteValidations from '../../validations/note';
import powerSelectOverlayedOptions from '../../mixins/power-select-overlayed-options'
import { A } from '@ember/array';
//import { observer } from '@ember/object';
//import EmberObject, { computed } from '@ember/object';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
//import { debounce } from '@ember/runloop';
import { inject } from '@ember/service';
import ENV from '../../config/environment';
import RSVP from 'rsvp';

export default Ember.Controller.extend(powerSelectOverlayedOptions, {
  OrderValidations,
  MessageValidations,
  NoteValidations,

  session: inject(),

  userId: computed.reads('session.data.authenticated.userid'),

  powerSelectOverlayedOptions: [{
    source: 'deliverySources',
    target: 'deliverySourceOptions',
    valueProperty: 'id',
    labelProperty: 'name',
    disabledProperty: 'isDisabled',
    noneLabel: 'Ej angivet'
  }, {
    source: 'deliveryMethods',
    target: 'deliveryMethodOptions',
    valueProperty: 'id',
    labelProperty: 'name',
    disabledProperty: 'isDisabled',
    noneLabel: 'Ej angivet'
  }, {
    source: 'statuses',
    target: 'statusOptions',
    valueProperty: 'id',
    labelProperty: 'nameSv',
    disabledProperty: 'isDisabled'
  }],

  isEditing: false,
  isCreatingMessage: false,
  isCreatingNote: false,
  errors: null,
  messageErrors: null,
  noteErrors: null,
  message: null,
  showAllValidations: false,

  messageLanguage: 'sv',
  emailTemplateId: null,
  addBiblioInfo: true,

  lastOrderViewed: null,

  librisUrl: computed('order.librisRequestId', function() {
    return ENV.APP.librisFjarrlanURL + this.get('order.librisRequestId');
  }),

  printOrderUrl: computed('order.id', function() {
    return ENV.APP.serviceURL +
      '/orders/' +
      this.get('order.id') +
      '.pdf?token=' +
      this.get('session.data.authenticated.token');
  }),

  printDeliveryNoteUrl: computed('order.id', function() {
     return ENV.APP.serviceURL +
       "/orders/" +
       this.get("order.id") +
       ".pdf?token=" +
       this.get('session.data.authenticated.token')
       + "&layout=delivery_note";
  }),

  kohaSearchUrl: computed('order.orderNumber', function() {
    return ENV.APP.kohaSearchURL + this.get('order.orderNumber');
  }),

  messageLanguageOption: computed('messageLanguage', function() {
    return this.get('messageLanguageOptions').findBy('language', this.get('messageLanguage'));
  }),

  emailTemplateOptions: computed('emailTemplates', function() {
    return this.get('emailTemplates').rejectBy('disabled');
  }),

  emailTemplate: computed('emailTemplateId', function() {
    return this.get('emailTemplateOptions').findBy('id', this.get('emailTemplateId'));
  }),

  emailTemplateSubject: computed('messageLanguageOption', 'emailTemplate', function() {
    let option = this.get('messageLanguageOption');
    let template = this.get('emailTemplate');
    return template ? template.get(option['subjectProperty']) : null;
  }),

  emailTemplateBody: computed('messageLanguageOption', 'emailTemplate', 'addBiblioInfo', function() {
    let option = this.get('messageLanguageOption');
    let template = this.get('emailTemplate');

    if (template) {
      let emailTemplateBody = template.get(option['bodyProperty']);
      if (this.get('addBiblioInfo')) {
        emailTemplateBody += this.get('biblioInfo');
      }
      return emailTemplateBody;
    }
    else {
      return null;
    }
  }),

  /*messageTemplateObserver: observer('messageLanguage', 'emailTemplateId') {
  },
  */

  /*
  messageObserver: observer('message', function() {
    debounce(this, () => {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.set('message', null);
      }
    }, 3000);
  }),
  */
  init() {
    this._super(...arguments);
    //this.set('messages', A());
    //TODO: Move to setupController?
    this.set('messageLanguageOptions', A([{
      label: 'Svenska',
      language: 'sv',
      subjectProperty: 'subjectSv',
      bodyProperty: 'bodySv'
    }, {
      label: 'Engelska',
      language: 'en',
      subjectProperty: 'subjectEn',
      bodyProperty: 'bodyEn'
    }]));
  },

  biblioInfo: computed(
    'order.name',
    'order.title',
    'order.orderNumber',
    'order.authors',
    'order.journalTitle',
    'messageLanguage',
    function () {
      let messageLanguage = this.get('messageLanguage');
      let properties = A([
        {
          key: 'orderNumber',
          en: 'Ordernumber',
          sv: 'Ordernummer'
        }, {
          key: 'name',
          en: 'Patron',
          sv: 'Låntagare'
        }, {
          key: 'title',
          en: 'Title',
          sv: 'Titel'
        }, {
          key: 'authors',
          en: 'Author',
          sv: 'Författare'
        }, {
          key: 'journalTitle',
          en: 'Journal title',
          sv: 'Tidskriftstitel'
        }
      ]);

      let order = this.get('order');
      let message = properties.map((item) => {
        let value = order.get(item.key);
        if (!isBlank(value)) {
          return item[messageLanguage] + ': ' +  order.get(item.key);
        }
        return false;
      })
        .filter((item) => { return !!item; })
        .join("\n") + "\n";
      let separator = '------------------------- \n';
      return "\n\n" + separator + message +  separator;
	}),

  actions: {
    /** Order **/
    saveOrder(changeset) {
      return new RSVP.Promise((resolve, reject) => {
        changeset.save().then(() => {
          this.get('notes').update().then(() => {
            this.set('isEditing', false);
            resolve();
          }).catch((error) => {
            //How avoid multiple error handlers
            console.dir(error);
            reject(error);
          });
        }).catch((error) => {
          //TODO: format of error??? Probably an object, produce error and test
          this.set('messageErrors', error);
          reject(error);
        });
      });
    },
    orderInvalid(changeset) {
      //TODO: translation of prop, lookup with i18n
      //and create custom validation message
      this.set('errors', changeset.get('errors').map((error) => {
        return error['validation'];
      }));
    },
    //TODO: inconsistent naming
    editOrder() {
      this.set('showAllValidations', false);
      this.set('isEditing', true);
    },
    cancelEditOrder(changeset) {
      this.set('isEditing', false);
      this.set('errors', null);
      changeset.rollback();
    },
    /** Message **/
    showCreateMessage() {
      // Need to reset these since not part of changeset
      this.set('messageLanguage', 'sv');
      this.set('emailTemplateId', null);
      this.set('addBiblioInfo', true);

      this.set('message',
        this.store.createRecord(
          'note',
          { isEmail: true, noteTypeId: this.get('noteTypes').findBy('label', 'email').id, userId: this.get('userId'), orderId: this.get('order.id') }
        )
      );
      this.set('isCreatingMessage', true);
    },
    cancelCreateMessage() {
      this.set('isCreatingMessage', false);
    },
    saveMessage(changeset) {
       return new RSVP.Promise((resolve, reject) => {
        changeset.save().then(() => {
          this.get('notes').update().then(() => {
            this.set('isCreatingMessage', false);
            resolve();
          }).catch((error) => {
            //How avoid multiple error handlers
            console.dir(error);
            reject(error);
          });
        }).catch((error) => {
          //TODO: format of error??? Probably an object, produce error and test
          this.set('messageErrors', error);
          reject(error);
        });
      });
    },
    messageInvalid(changeset) {
      this.set('messageErrors', changeset.get('errors').map((error) => {
        return error['validation'];
      }));
    },
    /** Note **/
    showCreateNote(note) {
      if (note) {
        this.set('note', note);
      }
      else {
        this.set('note',
          this.store.createRecord(
            'note',
            { isEmail: false, noteTypeId: this.get('noteTypes').findBy('label', 'user').id, userId: this.get('userId'), orderId: this.get('order.id') }
          )
        );
      }
      this.set('isCreatingNote', true);
    },
    cancelCreateNote() {
      this.set('isCreatingNote', false);
    },

    saveNote(changeset) {
      return new RSVP.Promise((resolve, reject) => {
        changeset.save().then(() => {
          this.get('notes').update().then(() => {
            this.set('isCreatingNote', false);
            resolve();
          }).catch((error) => {
            //How avoid multiple error handlers
            console.dir(error);
            reject(error);
          });
        }).catch((error) => {
          //TODO: format of error??? Probably an object, produce error and test
          this.set('noteErrors', error);
          reject(error);
        });
      });
    },
    noteInvalid(changeset) {
      this.set('noteErrors', changeset.get('errors').map((error) => {
        return error['validation'];
      }));
    },
    onTemplatePropertyChange(changeset, property, value) {
      if (this.get('emailTemplate')) {
        if (
            !isBlank(changeset.get('subject')) &&
            changeset.get('subject') != this.get('emailTemplateSubject') ||
            !isBlank(changeset.get('message')) &&
            changeset.get('message') != this.get('emailTemplateBody')
        ) {
          if (!confirm("Gjorda ändringar kommer att gå förlorade, tryck OK för att fortsätta.")) {
            return;
          }
        }
      }
      this.set(property, value);
      changeset.set('subject', this.get('emailTemplateSubject'));
      changeset.set('message', this.get('emailTemplateBody'));
      changeset.set('emailTemplateLabel', this.get('emailTemplate.label'));
    },

    onAddBiblioInfoChange(changeset, addBiblioInfo) {
      let message = changeset.get('message') || '';
      if(addBiblioInfo) {
        changeset.set(
          'message',
          message + this.get('biblioInfo')
        );
      }
      else {
        changeset.set(
          'message',
          message.replace(this.get('biblioInfo'), '')
        );
      }
      this.set('addBiblioInfo', addBiblioInfo);
    },

    deleteNote(noteId) {
      if (confirm('Är du säker på att du vill ta bort denna notering?')) {
        this.store.findRecord('note', noteId, {reload: true}).then(function(post) {
          post.destroyRecord();
        });
      }
    },

    /** Sticky note **/
    toggleStickyNote(noteId) {
      let order = this.get('order');
      order.set(
        'stickyNoteId',
        order.get('stickyNoteId') == noteId ? null : noteId
      );
      order.save().catch((error) => {
        //TODO: proper error handling
        // should be task!
        console.dir(error);
      })
    }
  }
});
