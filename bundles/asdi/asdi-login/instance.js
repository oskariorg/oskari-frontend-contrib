/**
 * @class Oskari.asdi.login.BundleInstance
 */
Oskari.clazz.define('Oskari.asdi.login.BundleInstance',
    function () {
        this.templates = {
            'loginButton': jQuery('<input id="loginbutton" type="submit" value="">')
        };
    }, {
        __name: 'asdi-login',
        getName: function () {
            return this.__name;
        },
        eventHandlers: {
        },
        /**
         * @method afterStart
         * implements BundleInstance protocol start methdod
         */
        afterStart: function () {
            var me = this;
            if (Oskari.user().isLoggedIn()) {
                // no need for login UI
                return;
            }
            // show login UI
            this.locale = Oskari.getLocalization(this.getName());
            this.flyout = this.getFlyout();

            var loginButton = this.templates.loginButton.clone();
            loginButton.val(this.locale.flyout.login);
            loginButton.on('click', function () {
                me.showLoginFlyout();
            });
            jQuery('#maptools').find('#login').append(loginButton);
            this._registerForGuidedTour();
        },
        showLoginFlyout: function () {
            Oskari.getSandbox().postRequestByName(
                'userinterface.UpdateExtensionRequest', [this, 'attach']
            );
        },
         /**
         * @static
         * @property __guidedTourDelegateTemplate
         * Delegate object given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        __guidedTourDelegateTemplate: {
            priority: 81,
            show: function () {
                // Nothing to do.
            },
            hide: function () {
                // Nothing to do.
            },
            getTitle: function () {
                return this.locale.guidedTour.title;
            },
            getContent: function () {
                var content = jQuery('<div></div>');
                content.append(this.locale.guidedTour.message);
                return content;
            },
            getLinks: function () {
                 // No links to show
                return [];
            },
            getPositionRef: function () {
                return jQuery('#login');
            }
        },
        /**
         * @method _registerForGuidedTour
         * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
         */
        _registerForGuidedTour: function () {
            var me = this;
            function sendRegister () {
                var requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if (requestBuilder && me.sandbox.hasHandler('Guidedtour.AddToGuidedTourRequest')) {
                    var delegate = {
                        bundleName: me.getName()
                    };
                    for (var prop in me.__guidedTourDelegateTemplate) {
                        if (typeof me.__guidedTourDelegateTemplate[prop] === 'function') {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop].bind(me); // bind methods to bundle instance
                        } else {
                            delegate[prop] = me.__guidedTourDelegateTemplate[prop]; // assign values
                        }
                    }
                    me.sandbox.request(me, requestBuilder(delegate));
                }
            }

            function handler (msg) {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            }

            var tourInstance = me.sandbox.findRegisteredModuleInstance('GuidedTour');
            if (tourInstance) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultExtension']
    }
);
