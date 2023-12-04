import olLayerImage from 'ol/layer/Image';
import olSourceImageWMS from 'ol/source/ImageWMS';
import { getZoomLevelHelper } from 'oskari-frontend/bundles/mapping/mapmodule/util/scale';

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

    function (config) {
        this.ajaxUrl = config?.ajaxUrl || Oskari.urls.getRoute('GetAnalysis') + '?';
        this.loc = Oskari.getMsg.bind(null, 'MapAnalysis');
    }, {
        __name: 'AnalysisLayerPlugin',
        _clazz: 'Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin',
        /** @static @property layerType type of layers this plugin handles */
        layertype: 'analysislayer',

        getLayerTypeSelector: function () {
            // WFS plugin handles events
        },

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl: function () {
            const type = this.layertype;
            const options = {
                type,
                ...this.loc('layer')
            };
            this.getSandbox().getService('Oskari.mapframework.service.MapLayerService')?.registerLayerForUserDataModelBuilder(options);
            // Let wfs plugin handle this layertype
            const wfsPlugin = this.getMapModule().getLayerPlugins('wfs');
            wfsPlugin.registerLayerType(type, 'Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer');
            this.unregister();
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
