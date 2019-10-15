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

export default Ember.Controller.extend({
	isShowingEmailTemplateEditModal: false,
	currentTemplate: null,
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

	    deleteTemplate(templateId) {
	      if (confirm('Är du säker på att du vill ta bort denna e-post mall?')) {
	        this.store.findRecord('email_template', templateId, {reload: true}).then(function(template) {
	          template.destroyRecord();
	        });
	      }
	    },
	    editTemplate(templateId) {
	      if (confirm('Är du säker på att du vill editera denna e-post mall?')) {
	        this.store.findRecord('email_template', templateId, {reload: true}).then(function(template) {
	          template.destroyRecord();
	        });
	      }
	    },
	    resetState() {
	      this.set('error', null);
	    },
	    onSubmit(changeset) {
			return new RSVP.Promise((resolve, reject) => {
				changeset.save().then(() => {
					this.send('toggleModal');
				}).catch((error) => {
				  //TODO: format of error??? Probably an object, produce error and test
				  this.set('messageErrors', error);
				  reject(error);
				});
			});
	    },
	}
});
