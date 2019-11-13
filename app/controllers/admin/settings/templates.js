import Ember from 'ember';
import EmailTemplateValidations from '../../../validations/email-template';
import powerSelectOverlayedOptions from '../../../mixins/power-select-overlayed-options'
import { A } from '@ember/array';
//import { observer } from '@ember/object';
//import EmberObject, { computed } from '@ember/object';
import { computed } from '@ember/object';
import { isBlank } from '@ember/utils';
//import { debounce } from '@ember/runloop';
import { inject } from '@ember/service';
import ENV from '../../../config/environment';
import RSVP from 'rsvp';

export default Ember.Controller.extend(powerSelectOverlayedOptions, {
  toast: inject(),
  isShowingEmailTemplateEditModal: false,
  currentTemplate: null,
  EmailTemplateValidations,

  powerSelectOverlayedOptions: [{
      source: 'managingGroups',
      target: 'managingGroupOptions',
      valueProperty: 'id',
      labelProperty: 'name',
      noneLabel: 'Inget valt'
    }, {
      source: 'pickupLocations',
      target: 'pickupLocationOptions',
      valueProperty: 'id',
      labelProperty: 'nameSv',
      noneLabel: 'Inget valt',
      /*disabledProperty: 'is_active'*/
    }],

  templates: computed('emailTemplate.@each.position', function() {
    return this.get("emailTemplate").sortBy('position').filterBy('isNew', false);
  }),

  generateGUID() {
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (dt + Math.random()*16)%16 | 0;
          dt = Math.floor(dt/16);
          return (c=='x' ? r :(r&0x3|0x8)).toString(16);
      });
      return uuid;
  },

  actions: {
    toggleModal(template) {
      if (this.get("isShowingEmailTemplateEditModal")) {
        this.set("isShowingEmailTemplateEditModal", false);
      }
      else {
        this.set("isShowingEmailTemplateEditModal", true);  
        this.set("currentTemplate", template);
      }
    },

    createTemplate() {
      let template = this.store.createRecord('email-template', {label: this.generateGUID()});
      this.send("toggleModal", template); 
    },

      deleteTemplate(templateId) {
        if (confirm('Är du säker på att du vill ta bort denna e-post mall?')) {
          this.store.findRecord('email_template', templateId, {reload: true}).then((template) => {
              template.destroyRecord().then(() => { 
              this.get('toast').success('E-post mallen togs bort.','Borttagen', {positionClass: 'toast-top-right', showDuration: '300', hideDuration: '1000', timeOut: '2000', extendedTimeOut: '2000'});
          });
          });
        }
      },
      resetState() {
      if (this.get("currentTemplate") && !this.get("currentTemplate.id")) {
        // remove record from store if not saved (ie cancel btn pressed)
        this.get("currentTemplate").deleteRecord();
      }
      },
      onSubmit(changeset) {
        let that = this;
      return new RSVP.Promise((resolve, reject) => {
        changeset.save().then((model) => {
          this.send('toggleModal');
          //this.send('refreshRoute');
          this.get('toast').success('E-post mallen uppdaterades.','Sparad', {positionClass: 'toast-top-right', showDuration: '300', hideDuration: '1000', timeOut: '2000', extendedTimeOut: '2000'});
          Ember.run.later(this, function () {
            Ember.$('tr').css("background-color", "transparent"); 
            Ember.$('#' + model.id ).css("background-color", "#c3e6cb");    
             }, 100);
        }).catch((error) => {
          reject(error);
        });
      });
      },
  }
});
