
import './request/ShowContentEditorRequest';
import './request/ShowContentEditorRequestHandler';
import './view/SideContentEditor';

/**
 * @class Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance
 *
 * See Oskari.tampere.bundle.content-editor.ContentEditorBundle for bundle definition.
 */
Oskari.clazz.define('Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.sandbox = null;
        this.plugins = {};
        this.sideContentEditor = null;
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'ContentEditor',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method start
         * Implements BundleInstance protocol start method
         */
        start: function () {
            const sandbox = Oskari.getSandbox();
            this.sandbox = sandbox;
            sandbox.register(this);
            Object.keys(this.eventHandlers).forEach(eventName => sandbox.registerForEventByName(this, eventName));

            // Let's extend UI
            sandbox.request(this, Oskari.requestBuilder('userinterface.AddExtensionRequest')(this));

            // create request handlers
            this.showContentEditorRequestHandler = Oskari.clazz.create(
                'Oskari.tampere.bundle.content-editor.request.ShowContentEditorRequestHandler',
                this
            );

            // register request handlers
            sandbox.requestHandler('ContentEditor.ShowContentEditorRequest', this.showContentEditorRequestHandler);
            this.__setupLayerTools();
        },

        /**
         * @method init
         * Implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },

        /**
         * @method update
         * Implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {

        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },

        /**
         * Fetches reference to the map layer service
         * @return {Oskari.mapframework.service.MapLayerService}
         */
        getLayerService: function () {
            return this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        },

        /**
         * Adds the Feature data tool for layer
         * @param  {String| Number} layerId layer to process
         * @param  {Boolean} suppressEvent true to not send event about updated layer (optional)
         */
        __addTool: function (layerModel, suppressEvent) {
            const service = this.getLayerService();
            if (typeof layerModel !== 'object') {
                // detect layerId and replace with the corresponding layerModel
                layerModel = service.findMapLayer(layerModel);
            }
            if (!layerModel ||
                !layerModel.hasPermission('EDIT_LAYER_CONTENT') ||
                !layerModel.isLayerOfType('WFS')) {
                return;
            }

            // add feature data tool for layer
            const label = this.getLocalization('title') || {};
            const tool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            tool.setName('content-editor');
            tool.setTitle(label);
            tool.setIconCls('show-content-editor-tool');
            tool.setTooltip(label);

            const sb = this.getSandbox();
            tool.setCallback(function () {
                sb.postRequestByName('ContentEditor.ShowContentEditorRequest', [layerModel.getId()]);
            });

            service.addToolForLayer(layerModel, tool, suppressEvent);
        },
        /**
         * Adds tools for all layers
         */
        __setupLayerTools: function () {
            // add tools for feature data layers
            const service = this.getLayerService();
            const layers = service.getAllLayers();
            layers.forEach((layer) => this.__addTool(layer, true));
            // update all layers at once since we suppressed individual events
            var event = Oskari.eventBuilder('MapLayerEvent')(null, 'tool');
            this.getSandbox().notifyAll(event);
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            FeatureEvent: function (event) {
                if (this.sideContentEditor == null || event.getOperation() !== 'click') {
                    return;
                }
                const currentLayer = this.sideContentEditor.getCurrentLayer().id;
                const editLayerFeatures = event.getFeatures().filter(f => f.layerId === currentLayer);
                if (!editLayerFeatures.length) {
                    // no features hit on layer that we are currently editing
                    return;
                }
                // found one -> edit it
                this.sideContentEditor.editFeature(editLayerFeatures[0].geojson.features[0]);
            },
            MapLayerEvent: function (event) {
                // adds edit tool for new layers
                if (event.getOperation() !== 'add') {
                    // only handle add layer
                    return;
                }
                if (event.getLayerId()) {
                    this.__addTool(event.getLayerId());
                } else {
                    // ajax call for all layers
                    this.__setupLayerTools();
                }
            }
        },
        /**
         * @method stop
         * Implements BundleInstance protocol stop method
         */
        stop: function () {
            const sandbox = this.getSandbox();
            Object.keys(this.eventHandlers)
                .forEach(eventName => sandbox.unregisterFromEventByName(this, eventName));
            sandbox.request(this, Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this));
            sandbox.unregister(this);
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         */
        startExtension: function () {},
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout
         */
        stopExtension: function () {},
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout
         */
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },

        /**
         * @method setEditorMode
         *
         * @param {Boolean} blnEnabled true to enable, false to disable/return to normal mode
         * @param {string} layerId
         */
        setEditorMode: function (blnEnabled, layerId) {
            const mapElement = document.getElementById('contentMap');
            const sandbox = this.getSandbox();
            const additionalClass = 'mapContentEditorMode';
            if (blnEnabled) {
                mapElement.classList.add(additionalClass); //addClass('mapContentEditorMode');
                const myRoot = document.createElement('div');
                mapElement.appendChild(myRoot);
                this.sideContentEditor = Oskari.clazz.create(
                    'Oskari.tampere.bundle.content-editor.view.SideContentEditor',
                    sandbox,
                    layerId,
                    () => this.setEditorMode(false)
                );
                this.sideContentEditor.render(myRoot);

                /*
// Force map size to match rest of screen: 
const content = jQuery('#contentMap');
const container = content.find('.row-fluid');
// Ugly hack, container has a nasty habit of overflowing the viewport...
const totalWidth = jQuery(window).width() - container.offset().left;
const mapContainer = container.find('.oskariui-center');
const mapDiv = this.mapmodule.getMapEl();

                
mapContainer.css({
    'width': mapWidth,
    'height': mapHeight
});

mapDiv.width(mapWidth);
                */
            } else {
                if (this.sideContentEditor) {
                    this.sideContentEditor.destroy();
                }
                mapElement.classList.remove(additionalClass); //removeClass('mapContentEditorMode');

                const request = Oskari.requestBuilder('userinterface.UpdateExtensionRequest')(this, 'close', this.getName());
                sandbox.request(this.getName(), request);
            }

            sandbox.postRequestByName('MapFull.MapSizeUpdateRequest', []);
        },
        showContentEditor: function (layerId) {
            // trigger an event letting other bundles know we require the whole UI
            var eventBuilder = Oskari.eventBuilder('UIChangeEvent');
            this.sandbox.notifyAll(eventBuilder(this.mediator.bundleId));
            this.setEditorMode(true, layerId);
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.userinterface.Extension'
        ]
    }
);
