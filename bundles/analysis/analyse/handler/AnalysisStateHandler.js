import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { createTempLayer, createFeatureLayer, eligibleForAnalyse, isUnsupportedWFS, getRandomizedStyle } from '../service/AnalyseHelper';
import { PROPERTIES, FILTER, BUFFER, METHODS } from '../constants';
import { showStyleEditor } from '../view/StyleForm';
import { getInitPropertiesSelections } from './AnalysisStateHelper';

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
            showDataWithoutSaving: false,
            noDataCnt: false  // TODO: or get from layer  when needed
        });
        this.eventHandlers = this.createEventHandlers();
        this.featureLayer = null;
        this.popupControls = null;
    };

    getName () {
        return 'AnalysisStateHandler';
    }

    _getInitState () {
        const selections = this.instance.getLayerIdsWithSelections();
        const layer = selections[0] || this._getAnalysisLayers()[0];
        const layerId = layer?.getId();
        const method = METHODS[0];
        const filter = selections[0] ? FILTER.FEATURES : FILTER.BBOX;
        const methodParams = this._initMethodParams(layer);
        const properties = getInitPropertiesSelections(layerlayer);
        return { layerId, method, filter, methodParams, properties };
    }

    _initMethodParams () {
        return {};
    }

    _getAnalysisLayers () {
        return this.getSandbox().findAllSelectedMapLayers().filter(l => eligibleForAnalyse(l));
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
        const handler = this.eventHandlers[e.getName()];
        if (!handler || !this.getState().enabled) {
            return;
        }
        return handler.apply(this, [e]);
    }

    setEnabled (enabled) {
        const state = enabled ? this._getInitState() : {};
        if(!enabled) {
            this._removeFeatureSource();
        }
        this.updateState({ ...state, enabled });
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

    gatherSelections () {
        return {};
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
