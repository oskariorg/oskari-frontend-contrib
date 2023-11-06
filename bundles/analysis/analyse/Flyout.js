import React from 'react';
import ReactDOM from 'react-dom';
import { FlyoutContent } from './view/FlyoutContent';
import { LocaleProvider } from 'oskari-ui/util';
import { COOKIE_KEY, COOKIE_SKIP_VALUE } from './constants';
/**
 * @class Oskari.analysis.bundle.analyse.Flyout
 *
 * Request analyse flyout. The flyout shows options for analyse actions
 *
 * Oskari.analysis.bundle.analyse.view.StartView (shown for logged in users).
 */
Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.Flyout',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance} instance
     * Reference to component that created the flyout
     *
     */
    function (instance) {
        this.instance = instance;
        this.container = null;
    }, {
        /**
         * @public @method getName
         *
         *
         * @return {String} the name for the component
         */
        getName: function () {
            return 'Oskari.analysis.bundle.analyse.Flyout';
        },

        /**
         * @public @method setEl
         * Interface method implementation
         *
         * @param {Object} el
         *      reference to the container in browser
         * @param {Number} width
         *      container size(?) - not used
         * @param {Number} height
         *      container size(?) - not used
         *
         */
        setEl: function (el, flyout) {
            this.container = el[0];
            this.container.classList.add('analyse');
            flyout.addClass('analyse');
        },
        startPlugin: function () {},

        /**
         * @public @method getTitle
         *
         *
         * @return {String} localized text for the title of the flyout
         */
        getTitle: function () {
            return this.instance.loc('flyouttitle');
        },
        onOpen: function () {
            // const cookie = new URLSearchParams(document.cookie.replaceAll('&', '%26').replaceAll('; ', '&')).get(COOKIE_KEY);
            if (jQuery.cookie(COOKIE_KEY) === COOKIE_SKIP_VALUE) {
                this.instance.setEnabled(true);
            } else {
                this.render();
            }
        },
        /**
         * @public @method getDescription
         *
         *
         * @return {String} localized text for the description of the
         * flyout
         */
        getDescription: function () {
            return this.instance.loc('desc');
        },

        /**
         * @public @method refresh
         *
         *
         */
        render: function () {
            if (!this.container) {
                return;
            }
            const content = (
                <LocaleProvider value={{ bundleKey: this.instance.getName() }}>
                    <FlyoutContent setEnabled={enabled => this.instance.setEnabled(enabled)} />
                </LocaleProvider>
            );
            ReactDOM.render(content, this.container);
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.userinterface.Flyout']
    }
);
