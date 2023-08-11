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
                ...this.loc('layer'),
                createTools: [layer => this._createFilterTool(layer)]
            };
            this.getSandbox().getService('Oskari.mapframework.service.MapLayerService')?.registerLayerForUserDataModelBuilder(options);
            // Let wfs plugin handle this layertype
            const wfsPlugin = this.getMapModule().getLayerPlugins('wfs');
            wfsPlugin.registerLayerType(type, 'Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer');
            this.unregister();
        },
        _createFilterTool: function (layer) {
            const filterdataTool = Oskari.clazz.create('Oskari.mapframework.domain.Tool');
            filterdataTool.setName('filterdata');
            filterdataTool.setIconCls('show-filter-tool');
            filterdataTool.setTooltip(this.loc('filterTooltip'));
            filterdataTool.setCallback(() => {
                const service = this.getSandbox().getService('Oskari.analysis.bundle.analyse.service.AnalyseService');
                const isAggregateValueAvailable = !!service;
                const fixedOptions = {
                    bboxSelection: true,
                    clickedFeaturesSelection: false,
                    addLinkToAggregateValues: isAggregateValueAvailable
                };
    
                const filterDialog = Oskari.clazz.create('Oskari.userinterface.component.FilterDialog', fixedOptions);
                filterDialog.setUpdateButtonHandler((filters) => {
                    // throw event to new wfs
                    const filteringChangeEvent = Oskari.eventBuilder('WFSSetPropertyFilter');
                    this.sandbox.notifyAll(filteringChangeEvent(filters, layer.getId()));
                });
    
                if (isAggregateValueAvailable) {
                    const aggregateAnalyseFilter = Oskari.clazz.create('Oskari.analysis.bundle.analyse.aggregateAnalyseFilter', filterDialog);
    
                    filterDialog.createFilterDialog(layer, null, () =>  {
                        // FIXME: why is bind() used here? can it be removed?
                        service._returnAnalysisOfTypeAggregate((listOfAggregateAnalysis) => aggregateAnalyseFilter.addAggregateFilterFunctionality(listOfAggregateAnalysis));
                    });
                } else {
                    filterDialog.createFilterDialog(layer);
                }
                filterDialog.setCloseButtonHandler(() => {
                    filterDialog.popup.dialog.off('click', '.add-link');
                });
            });
            return filterdataTool;
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
