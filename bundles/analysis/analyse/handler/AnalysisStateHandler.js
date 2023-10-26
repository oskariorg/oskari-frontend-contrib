import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { createTempLayer, createFeatureLayer, eligibleForAnalyse, isUnsupportedWFS, getRandomizedStyle } from '../service/AnalyseHelper';
import { PROPERTIES, FILTER, BUFFER, METHODS } from '../view/constants';
import { showStyleEditor } from './StyleForm';

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
            targetId: null,
            filter: Object.values(FILTER)[1],
            method: METHODS[0],
            properties: {
                type: Object.values(PROPERTIES)[0],
                selected: []
            },
            methodParams: {},
            style: getRandomizedStyle(),
            showFeatureData: true,
            showDataWithoutSaving: false
        });
        this.eventHandlers = this.createEventHandlers();
        this.featureLayer = null;
        this.popupControls = null;
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
        // TODO: auto selections and isTemp
        this.updateState({layerId});
    }

    setTargetLayerId (targetId) {
        this.updateState({targetId});
    }

    setValue (key, value) {
        this.updateState({ [key]: value });
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
        this.selectedUpdateListeners.forEach(consumer => consumer(this.getState()));
    }

    removeLayer (layerId) {
        if (this.sandbox.isLayerAlreadySelected()) {
            this.sandbox.postRequestByName('RemoveMapLayerRequest', [layerId]);
            // listens remove event
            return;
        }
        const { tempLayers } = this.getState();
        const layer = tempLayers.find(l => l.getId() === layerId);
        if (!layer) {
            return;
        }
        this._getFeatureSource().removeFeature(layer.getFeature());
        this.updateState({ tempLayers: tempLayers.filter(l => l.getId() !== layerId) });
    }

    openStyleEditor () {
        if (this.popupControls) {
            return;
        }
        const { style } = this.getState();
        const onSave = style => {
            this.updateState({ style });
            this.closeStyleEditor();
        };
        const onClose = () => this.closeStyleEditor();
        this._popupControls = showStyleEditor(style, onSave, onClose)
    }

    closeStyleEditor () {
        if (this._popupControls) {
            this._popupControls.close();
        }
        this._popupControls = null;
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
}

const wrapped = controllerMixin(Handler, [
    'setEnabled',
    'setValue',
    'addTempLayer',
    'removeLayer',
    'setAnalysisLayerId',
    'setTargetLayerId',
    'gatherSelections'
]);

export { wrapped as AnalysisStateHandler };
