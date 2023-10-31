import React from 'react';
import { Message } from 'oskari-ui';
import { AnalysisHandler } from './handler/AnalysisHandler';
import { AnalysisStateHandler } from './handler/AnalysisStateHandler';
import { AnalysisTab } from './view/AnalysisTab';
import { showSidePanel } from 'oskari-ui/components/window';
import { MainPanel } from './view/MainPanel';
import { eligibleForAnalyse, createPointFeature } from './service/AnalyseHelper';


/**
 * @class Oskari.analysis.bundle.analyse.AnalyseBundleInstance
 *
 * Main component and starting point for the analysis functionality. Analyse parameters dialog
 * is a layout down tool to configure analyse parameters .
 *
 * See Oskari.analysis.bundle.analyse.AnalyseBundle for bundle definition.
 *
 */
Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.AnalyseBundleInstance',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        this.sandbox = undefined;
        this.started = false;
        this.plugins = {};
        this.tabHandler = undefined;
        this.stateHandler = null;
        this.analyseService = undefined;
        this.loc = Oskari.getMsg.bind(null, this.getName());
        this.featureSelectionService = null;
        this.sidePanel = null;
    }, {
        /**
         * @static @property __name
         */
        __name: 'Analyse',

        getName: function () {
            return this.__name;
        },

        getSandbox: function () {
            return this.sandbox;
        },
        getAnalyseService: function () {
            return this.analyseService;
        },
        getStateHandler: function () {
            return this.stateHandler;
        },
        getSelectionService: function () {
            if (!this.featureSelectionService) {
                this.featureSelectionService = this.sandbox.getService('Oskari.mapframework.service.VectorFeatureSelectionService');
            }
            return this.featureSelectionService;
        },
        getLayerIdsWithSelections: function () {
            const service = this.getSelectionService();
            if (!service) {
                return [];
            }
            return service.getLayerIdsWithSelections();
        },
        getSelectionsForLayer: function (optLayerId) {
            const service = this.getSelectionService();
            if (!service) {
                return [];
            }
            const layerId = optLayerId || this.getStateHandler().getState().layerId;
            return service.getSelectedFeatureIdsByLayer(layerId);
        },
        emptySelections: function (optLayerId) {
            const service = this.getSelectionService();
            if (!service) {
                return;
            }
            const layerId = optLayerId || this.getStateHandler().getState().layerId;
            return service.removeSelection(layerId);
        },

        /**
         * @public @method start
         * Implements BundleInstance protocol start method
         *
         *
         */
        start: function () {
            if (this.started) {
                return;
            }
            const conf = this.conf || {};
            const sandboxName = conf.sandbox || 'sandbox';
            const sandbox = Oskari.getSandbox(sandboxName);
            this.sandbox = sandbox;
            this.started = true;

            sandbox.register(this);

            // requesthandler
            this.analyseHandler = Oskari.clazz.create('Oskari.analysis.bundle.analyse.request.AnalyseRequestHandler', this);
            sandbox.requestHandler('analyse.AnalyseRequest', this.analyseHandler);
            this.analyseService = Oskari.clazz.create('Oskari.analysis.bundle.analyse.service.AnalyseService', this);
            sandbox.registerService(this.analyseService);

            this.stateHandler = new AnalysisStateHandler(this);
            this.stateHandler.addStateListener(state => this.updatePanel(state));

            // Let's extend UI
            const request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);

            // Load analysis layers
            if (Oskari.user().isLoggedIn()) {
                this.analyseService.loadAnalyseLayers();
            }

            /* stateful */
            if (conf.stateful === true) {
                sandbox.registerAsStateful(this.mediator.bundleId, this);
            }
            this._addTab();
        },

        /**
         * @public @method init
         * Implements Module protocol init method - does nothing atm
         *
         *
         */
        init: function () {
            return null;
        },

        /**
         * @public @method update
         * Implements BundleInstance protocol update method - does nothing atm
         *
         *
         */
        update: function () {

        },
        _addTab: function (appStarted) {
            const sandbox = this.getSandbox();
            let myDataService = sandbox.getService('Oskari.mapframework.bundle.mydata.service.MyDataService');
    
            if (myDataService) {
                myDataService.addTab('analysis', this.loc('personalDataTab.title'), AnalysisTab, new AnalysisHandler(this));
            } else if (!appStarted) {
                // Wait for the application to load all bundles and try again
                Oskari.on('app.start', () => {
                    this._addTab(true);
                });
            }
        },
        /**
         * @public @method stop
         * Implements BundleInstance protocol stop method
         *
         *
         */
        stop: function () {
            const sandbox = this.getSandbox();
            sandbox.removeRequestHandler('analyse.AnalyseRequest', this.analyseHandler);
            this.analyseHandler = null;

            const request = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            sandbox.unregisterStateful(this.mediator.bundleId);
            sandbox.unregister(this);
            this.started = false;
        },

        /**
         * @public @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout
         * Oskari.analysis.bundle.analyse.Flyout
         *
         *
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create(
                'Oskari.analysis.bundle.analyse.Flyout',
                this
            );
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create(
                'Oskari.analysis.bundle.analyse.Tile',
                this
            );
        },

        /**
         * @public @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         *
         *
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },

        /**
         * @public @method getPlugins
         * Implements Oskari.userinterface.Extension protocol getPlugins method
         *
         *
         * @return {Object} References to flyout and tile
         */
        getPlugins: function () {
            return this.plugins;
        },

        /**
         * @public @method getTitle
         *
         *
         * @return {String} Localized text for the title of the component
         */
        getTitle: function () {
            return this.loc('title');
        },

        /**
         * @public @method getDescription
         *
         *
         * @return {String} Localized text for the description of the component
         */
        getDescription: function () {
            return this.loc('desc');
        },

        setEnabled: function (blnEnabled) {
            // trigger an event letting other bundles know we require the whole UI
            const eventBuilder = Oskari.eventBuilder('UIChangeEvent');
            this.sandbox.notifyAll(eventBuilder(this.mediator.bundleId));
            if (blnEnabled) {
                this.showPanel();
            } else {
                this.closePanel();
            }
            this._setSearchResultAction(blnEnabled);
            this.stateHandler.getController().setEnabled(blnEnabled);
            // hide flyout
            this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
        },
        _setSearchResultAction: function (enabled) {
            const sandbox = this.getSandbox();
            const key = enabled ? 'Add' : 'Remove';
            const requestName = `Search.${key}SearchResultActionRequest`;
            if (!sandbox.hasHandler(requestName)) {
                return;
            }

            /**
            * function gets called in search bundle with
            * the search result as an argument which in turn returns
            * a function that gets called when the user clicks on the link
            * in the search result popup.
            **/
            const resultAction = (result) => {
                return () => {
                    const { lon, lat, name } = result;
                    const feature = createPointFeature({ lon, lat });
                    this.getStateHandler().addTempLayer({ feature, name });
                };
            };
            const link = this.loc('AnalyseView.content.search.resultLink');
            const builder = Oskari.requestBuilder(requestName);
            const request = enabled
                ? builder(link, resultAction, this)
                : builder(link);
            sandbox.request(this, request);
        },
        getProps: function () {
            return {
                controller: this.stateHandler.getController(),
                state: this.stateHandler.getState(),
                featureIds: this.getSelectionsForLayer(),
                layers:  this.getSandbox().findAllSelectedMapLayers().filter(l => eligibleForAnalyse(l)),
                onClose: () => this.setEnabled(false)
            };
        },
        updatePanel: function () {
            if (!this.sidePanel) {
                return;
            }
            this.sidePanel.update(
                <Message bundleKey={this.getName()} messageKey='AnalyseView.title' />,
                <MainPanel {...this.getProps() } />
            );
        },
        showPanel: function () {
            if (this.sidePanel) {
                return;
            }
            const props = this.getProps();
            this.sidePanel = showSidePanel(
                <Message bundleKey={this.getName()} messageKey='AnalyseView.title' />,
                <MainPanel {...props } />,
                props.onClose,
                { width: 350, id: this.getName() }
            );
        },
        closePanel: function () {
            if (!this.sidePanel) {
                return;
            }
            this.sidePanel.close();
            this.sidePanel = null;
        },
        setState: function (state) {},

        getState: function () {
            return {};
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension',
            'Oskari.userinterface.Stateful'
        ]
    }
);
