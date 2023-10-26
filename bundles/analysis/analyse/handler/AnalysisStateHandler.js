import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { createTempLayer, createFeatureLayer, eligibleForAnalyse, isUnsupportedWFS } from '../service/AnalyseHelper';

class Handler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.loc = instance.loc;
        this.setState({
            enabled: false,
            tempLayers: [],
            layerId: null,
            filter: null
        });
        this.eventHandlers = this.createEventHandlers();
        this.featureLayer = null;
        this.selectedUpdateListeners = [];
    };

    getName () {
        return 'AnalysisStateHandler';
    }

    createEventHandlers () {
        const sandbox = this.instance.getSandbox();
        const handlers = {
            AfterMapLayerAddEvent: (event) => {
                const layer = event.getMapLayer();
                if (isUnsupportedWFS(layer)) {
                    Messaging.warn(this.loc('AnalyseView.error.not_supported_wfs_maplayer'));
                    return;
                }
                if (!eligibleForAnalyse(layer)) {
                    return;
                }
                this.setAnalysisLayerId(layer.getId());
            },
            AfterMapLayerRemoveEvent: (event) => {
                const layerId = event.getMapLayer().getId();
                if (this.getState().layerId === layerId) {
                    this._selectAnalysisLayerId();
                } else {
                    // selected layers aren't stored to state, trigger change
                    this.notify();
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }

    setEnabled (enabled) {
        this._selectAnalysisLayerId();
        if(!enabled) {
            this._removeFeatureSource();
        }
        this.updateState({ enabled });
    }

    setAnalysisLayerId (layerId) {
        this.updateState({layerId});
        this.selectedUpdateListeners.forEach(consumer => consumer(this.getState()));
    }

    setFilter (filter) {
        this.updateState({ filter });
    }

    _selectAnalysisLayerId () {
        const selections = this.instance.getLayerIdsWithSelections();
        const layerId = selections[0] || this.getLayers()[0]?.getId();
        this.setAnalysisLayerId(layerId);
    }

    addTempLayer (data) {
        const { feature } = data;
        if (!feature) {
            return;
        }
        this._getFeatureSource().addFeature(feature);
        const layer = createTempLayer(data);
        const tempLayers = [...this.getState().tempLayers, layer];
        const layerId = layer.getId();
        this.updateState({ tempLayers, layerId });
    }

    removeTempLayer (id) {
        const { tempLayers } = this.getState();
        const layer = tempLayers.find(l => l.getId() === id);
        if (!layer) {
            return;
        }
        this._getFeatureSource().removeFeature(layer.getFeature());
        this.updateState({ tempLayers: tempLayers.filter(l => l.getId() !== id) });
    }

    _getFeatureSource () {
        if (!this.featureLayer) {
            this.featureLayer = createFeatureLayer();
            const mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            mapModule.addOverlayLayer(this.featureLayer);
        }
        return this.featureLayer.getSource();
    }

    _removeFeatureSource () {
        const mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
        mapModule.removeLayer(this.featureLayer);
        this.featureLayer = null;
    }

    /* getters for jQuery */
    getSelectedMapLayer () {
        const { layerId, tempLayers } = this.getState();
        return this.sandbox.findMapLayerFromSelectedMapLayers(layerId) || tempLayers.find(l => l.getId() === layerId);
    }

    getLayers () {
        const layers = this.sandbox.findAllSelectedMapLayers().filter(l => eligibleForAnalyse(l));
        const { tempLayers = [] } = this.getState(); // fix timing
        return [...layers, ...tempLayers];
    }
}

const wrapped = controllerMixin(Handler, [
    'setEnabled',
    'addTempLayer',
    'removeTempLayer',
    'setAnalysisLayerId',
    'setFilter',
    'getLayers',
    'getSelectedMapLayer'
]);

export { wrapped as AnalysisStateHandler };
