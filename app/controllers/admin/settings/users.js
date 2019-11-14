import Ember from 'ember';
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
    isShowingUserEditModal: false,
    currentUser: null,

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

    pickupLocationsDisabled: computed('currentUser.managingGroupId', function() {
        if (this.get("currentUser.managingGroupId")) {
            return true;
        }
        return false;
    }),



    usersExtended: computed('user.@each.{xkonto,name,managingGroupId,pickupLocationId}', function(item) {
        let that = this;
        return this.get("user").forEach(function(item) {
            if (item.managingGroupId) {
                item.set('managingGroupName', that.get('managingGroups').findBy('id', item.managingGroupId.toString()).name);
            } 
            else {
                item.set('managingGroupName', '');
            }
            if (item.pickupLocationId) {
                item.set("pickupLocationName", (that.get('pickupLocations').findBy('id', item.pickupLocationId.toString())) ? that.get('pickupLocations').findBy('id', item.pickupLocationId.toString()).nameSv : null);
            }
            else {
                item.set('pickupLocationName', '');
            }
            if (item.pickupLocationId) {
                //item.set("pickupLocationIsActive", that.get('pickupLocations').findBy('id', item.pickupLocationId).is_active);
            }
            else {
                item.set("pickupLocationIsActive", false);
            }
            return item;
        });
    }),

    usersExtendedSorted: computed('usersExtended', function() {
        return this.get("usersExtended").sortBy('name').filterBy('isNew', false);
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
        toggleModalUser(user) {
            if (this.get("isShowingUserEditModal")) {
                this.set("isShowingUserEditModal", false);
            }
            else {
                this.set("isShowingUserEditModal", true);   
                this.set("currentUser", user);
            }
        },

        createUser() {
            let user = this.store.createRecord('user', {});
            this.send("toggleModalUser", user); 
        },

        onModalClose() {
            this.send("toggleModalUser");
        },

        resetState() {
          this.set('messageErrors', null);
            if (this.get("currentUser") && !this.get("currentUser.id")) {
                this.get("currentUser").deleteRecord();
            }
        },

        onSubmit(changeset) {
            return new RSVP.Promise((resolve, reject) => {
                changeset.save().then((model) => {
                    this.send('toggleModalUser');
                    this.get('toast').success('Användaren uppdaterades.','Sparad', {positionClass: 'toast-top-right', showDuration: '300', hideDuration: '1000', timeOut: '2000', extendedTimeOut: '2000'});
                    Ember.run.later(this, function () {
                        Ember.$('tr').css("background-color", "transparent"); 
                        Ember.$('#' + model.id ).css("background-color", "#c3e6cb");      
                     }, 100);
                }).catch((error) => {
                    if (error.errors) {
                        if (error.errors.xkonto) {
                            changeset.addError('xkonto', error.errors.xkonto);  
                        }
                        if (error.errors.name) {
                            changeset.addError('name', error.errors.name);  
                        }
                    }
                });
            });
        },
    }
});
