/**
 * @class Oskari.mapframework.bundle.asdiguidedtour.ASDIGuidedTourBundleInstance
 *
 * Add this to startupsequence to get this bundle started
 {
   bundlename : 'guided-tour-extension'
 }
 */
Oskari.clazz.define(
    'Oskari.framework.bundle.guidedtourextension.BundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (locale) {
        this.sandbox = null;
        this._localization = null;
    },
    {
        /**
         * @static
         * @property __name
         */
        __name: 'guided-tour-extension',

        /**
         * @method getName
         * Module protocol method
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getTitle
         * Extension protocol method
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this._localization.title;
        },

        /**
         * @method getDescription
         * Extension protocol method
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this._localization.desc;
        },

        /**
         * @method update
         * BundleInstance protocol method
         */
        update: function () {},

        /**
         * @method start
         * BundleInstance protocol method
         */
        start: function () {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }

            var me = this,
                conf = me.conf, // Should this not come as a param?
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName);
            me.sandbox = sandbox;
            // register to sandbox as a module
            sandbox.register(me);
            me._registerSteps();
        },
        _registerSteps: function () {
            var me = this;
            // Add steps defined in this bundle to Oskari Guided Tour
            me._guideSteps.forEach(step => {
                step.setScope(this);
                me.sandbox.postRequestByName('Guidedtour.AddToGuidedTourRequest', [step]);
            });
        },

        _guideSteps: [
        {   
            priority: 51,
            setScope: function (inst) {
                this.ref = inst;
            },
            show: function () {
                this.ref.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'maplegend']);
            },
            hide: function () {
                this.ref.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'maplegend']);
            },
            getTitle: function () {
                return this.ref._localization.maplegends.title;
            },
            getContent: function () {
                var content = jQuery('<div></div>');
                content.append(this.ref._localization.maplegends.message);
                content.append('<br><br>');
                return content;
            },
        },
        {
            priority: 52,
            setScope: function (inst) {
                this.ref = inst;
            },
            show: function () {
                this.ref.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'userinterface.UserGuide']);
            },
            hide: function () {
                this.ref.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'userinterface.UserGuide']);
            },
            getTitle: function () {
                return this.ref._localization.userguide.title;
            },
            getContent: function () {
                var me = this.ref;
                var loc = me._localization.userguide;
                var content = jQuery('<div></div>');
                content.append(loc.message);
                content.append('<br><br>');
                return content;
            }
        },
        {
            priority: 61,
            setScope: function (inst) {
                this.ref = inst;
            },
            getTitle: function () {
                return this.ref._localization.registration.title;
            },
            getContent: function () {
                var me = this.ref;
                var loc = me._localization.registration;
                var content = jQuery('<div></div>');
                content.append(loc.message);
                content.append('<br><br>');
                return content;
            },
            getPositionRef: function () {
                return jQuery('#login');
            },
            positionAlign: 'right'
        }],
        /**
         * @method init
         * Module protocol method
         */
        init: function () {
            // headless module so nothing to return
            return null;
        },

        /**
         * @method onEvent
         * Module protocol method/Event dispatch
         */
        onEvent: function (event) {
            var me = this;
            var handler = me.eventHandlers[event.getName()];
            if (!handler) {
                var ret = handler.apply(this, [event]);
                if (ret) {
                    return ret;
                }
            }
            return null;
        },

        /**
         * @static
         * @property eventHandlers
         * Best practices: defining which
         * events bundle is listening and how bundle reacts to them
         */
        eventHandlers: {
            // not listening to any events
        },

        /**
         * @method stop
         * BundleInstance protocol method
         */
        stop: function () {
            // unregister module from sandbox
            this.sandbox.unregister(this);
        }
    }, {
        protocol: ['Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module'
        ]
    }
);
