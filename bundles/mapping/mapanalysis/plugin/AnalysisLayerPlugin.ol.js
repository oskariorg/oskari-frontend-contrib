import olLayerImage from 'ol/layer/Image';
import olSourceImageWMS from 'ol/source/ImageWMS';
import { getZoomLevelHelper } from '../../mapmodule/util/scale';

/**
 * @class Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin
 * Provides functionality to draw Analysis layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */

    function () {
        var me = this;
        me.ajaxUrl = null;
        if (me._config && me._config.ajaxUrl) {
            me.ajaxUrl = me._config.ajaxUrl;
        }
        this._log = Oskari.log(this.getName());
    }, {
        __name: 'AnalysisLayerPlugin',
        _clazz: 'Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin',
        /** @static @property layerType type of layers this plugin handles */
        layertype: 'analysislayer',

        getLayerTypeSelector: function () {
            return this.layertype; // 'ANALYSIS';
        },

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl: function () {
            const layerClass = 'Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer';
            const modelBuilderClass = 'Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayerModelBuilder';
            const layerModelBuilder = Oskari.clazz.create(modelBuilderClass, this.getSandbox());

            const wfsPlugin = this.getMapModule().getLayerPlugins('wfs');
            if (typeof wfsPlugin.registerLayerType === 'function') {
                // Let wfs plugin handle this layertype
                wfsPlugin.registerLayerType(this.layertype, layerClass, layerModelBuilder);
                this.unregister();
                return;
            }
            // register domain builder
            const mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (!mapLayerService) {
                return;
            }
            mapLayerService.registerLayerModel(this.layertype, layerClass);
            mapLayerService.registerLayerModelBuilder(this.layertype, layerModelBuilder);
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol.
         */
        _startPluginImpl: function () {
            if (!this.ajaxUrl) {
                this.ajaxUrl =
                    Oskari.urls.getRoute('GetAnalysis') + '?';
            }
        },

        /**
         * Adds a single Analysis layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var me = this,
                imgUrl = layer.getWpsUrl() + layer.getWpsLayerId(),
                wms = {
                    'URL': imgUrl,
                    'LAYERS': layer.getWpsName(),
                    'FORMAT': 'image/png'
                },
                visible = layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                opacity = layer.getOpacity() / 100,
                openlayer = new olLayerImage({
                    source: new olSourceImageWMS({
                        url: wms.URL,
                        params: {
                            'LAYERS': wms.LAYERS,
                            'FORMAT': wms.FORMAT
                        },
                        crossOrigin: layer.getAttributes('crossOrigin')
                    }),
                    visible: visible,
                    opacity: opacity
                });

            const zoomLevelHelper = getZoomLevelHelper(this.getMapModule().getScaleArray());
            // Set min max zoom levels that layer should be visible in
            zoomLevelHelper.setOLZoomLimits(openlayer, layer.getMinScale(), layer.getMaxScale());

            this._registerLayerEvents(openlayer, layer);
            this.getMapModule().addLayer(openlayer, !keepLayerOnTop);

            // store reference to layers
            this.setOLMapLayers(layer.getId(), openlayer);

            me._log.debug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for AnalysisLayer ' +
                layer.getId()
            );
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL3 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
        _registerLayerEvents: function (layer, oskariLayer) {
            var me = this;
            var source = layer.getSource();

            source.on('imageloadstart', function () {
                me.getMapModule().loadingState(oskariLayer.getId(), true);
            });

            source.on('imageloadend', function () {
                me.getMapModule().loadingState(oskariLayer.getId(), false);
            });

            source.on('imageloaderror', function () {
                me.getMapModule().loadingState(oskariLayer.getId(), null, true);
            });
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
