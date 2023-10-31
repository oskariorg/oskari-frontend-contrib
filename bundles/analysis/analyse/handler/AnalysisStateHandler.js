import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { createTempLayer, createFeatureLayer, eligibleForAnalyse, isUnsupportedWFS, getRandomizedStyle, isTempLayer, getProperties, getFeatureFromDrawing, getDrawRequestType } from '../service/AnalyseHelper';
import { PROPERTIES, FILTER, METHODS, METHOD_OPTIONS, DRAW_ID, DRAW_OPTIONS } from '../constants';
import { showStyleEditor } from '../view/StyleForm';
import { showAggregateResults } from '../view/method/AggregateResults';
import { showDrawHelper } from '../view/DrawHelper';
import { getInitPropertiesSelections, getInitMethodParams, gatherMethodParams, showInfosForLayer  } from './AnalysisStateHelper';
import { Validator } from '../view/AnalyseValidations';

class Handler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.loc = instance.loc;
        this.validator = new Validator(instance);
        this.setState({
            enabled: false,
            tempLayers: [],
            layerId: null,
            targetId: null,
            name: '',
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
        this.drawHelper = null;
        this.storeDrawing = false;
    };

    getName () {
        return 'AnalysisStateHandler';
    }

    _getInitState () {
        const selections = this.instance.getLayerIdsWithSelections();
        const layer = selections[0] || this._getAnalysisLayers()[0];
        showInfosForLayer(layer);
        const layerId = layer?.getId();
        // is temp layer suitable for target -> [...layer, ...tempLayers]
        const targetLayer = this._getAnalysisLayers().find(l => l.getId() !== layerId);
        const method = METHODS[0];
        const filter = selections[0] ? FILTER.FEATURES : FILTER.BBOX;
        const methodParams = getInitMethodParams(method, layer, targetLayer);
        const properties = getInitPropertiesSelections(method, layer, targetLayer);
        const name = layer ? layer.getName().substring(0, 15) + '_' : '';
        return { layerId, method, filter, methodParams, properties, name };
    }

    _initMethodParams () {
        return {};
    }

    _getAnalysisLayers () {
        return this.sandbox.findAllSelectedMapLayers().filter(l => eligibleForAnalyse(l));
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
                    this.setAnalysisLayerId();
                } else {
                    // selected layers aren't stored to state, trigger change
                    this.notify();
                }
            },
            DrawingEvent: (event) => {
                // handle only finished drawings when helper is closed
                if (event.getId() === DRAW_ID && event.getIsFinished() && this.storeDrawing) {
                    const feature = getFeatureFromDrawing(event.getGeoJson());
                    this.addTempLayer({feature});
                    // feature is stored to temp layer remove from draw layer
                    this._closeDrawHelper();
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
            this._closePopup();
        }
        this.updateState({ ...state, enabled });
    }

    openFlyout (flyout) {
        if (flyout === 'layerlist') {
            const filter = 'featuredata';
            this.sandbox.postRequestByName('ShowFilteredLayerListRequest', [filter, true])
        }
        if (flyout === 'search') {
            const extension = {
                getName: () => 'Search'
            };
            this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'attach']);
        }
    }

    showDrawHelpper (type) {
        // remove old helper and drawings if exists
        this._closeDrawHelper(true);
        const drawType = getDrawRequestType(type);
        this.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [DRAW_ID, drawType, DRAW_OPTIONS]);
        const onClose = (isCancel) => {
            if (isCancel) {
                this._closeDrawHelper(isCancel);
            } else {
                this.storeDrawing = true;
                this.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [DRAW_ID]);
            }
        };
        this.drawHelper = showDrawHelper(type, onClose);
    }

    _closeDrawHelper () {
        if (!this.drawHelper) {
            return;
        }
        this.drawHelper.close();
        this.drawHelper = null;
        this.storeDrawing = false;
        this.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [DRAW_ID, true, true]);
    }

    setAnalysisLayerId (layerId) {
        // TODO: auto selections and isTemp
        this.updateState({layerId});
    }

    setTargetLayerId (targetId) {
        this.updateState({targetId});
    }

    setMethod (method) {
        const methodParams = getInitMethodParams(method);
        this.updateState({ method, methodParams });
    }

    setMethodParam (key, value) {
        const old = this.getState().methodParams;
        this.updateState({ methodParams: {...old, [key]: value }});
    }

    setProperties (key, value) {
        const old = this.getState().properties;
        this.updateState({ properties: {...old, [key]: value }});
    }

    setValue (key, value) {
        this.updateState({ [key]: value });
    }

    setShowDataWithoutSaving (value) {
        this.updateState({ showDataWithoutSaving: value, showFeatureData: !value });
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

    _findLayer (layerId) {
        const layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if (layer) {
            return layer;
        }
        return this.getState().tempLayers.find(l => l.getId() === layerId);
    }

    openStyleEditor () {
        if (this.popupControls) {
            this._closePopup();
        }
        const { style } = this.getState();
        const onSave = style => {
            this.updateState({ style });
            this._closePopup();
        };
        const onClose = () => this._closePopup();
        this.popupControls = showStyleEditor(style, onSave, onClose);
    }

    openAggregateResults (json) {
        if (this.popupControls) {
            this._closePopup();
        }
        const layer = this._findLayer(json.id);
        const onClose = () => this._closePopup();
        this.popupControls = showAggregateResults(layerJson, layer, onClose);
    }

    _closePopup () {
        if (this.popupControls) {
            this.popupControls.close();
        }
        this.popupControls = null;
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

    commitAnalysis () {
        const state = this.getState();
        const layer = this._findLayer(state.layerId);
        if (!layer) {
            Messaging.error(this.loc('AnalyseView.error.noLayer'));
            return;
        }
        const isTemp = isTempLayer(layer);
        const selections = {
            layerId: isTemp ? -1 : layer.getId(),
            name: state.name,
            fields: this._getPropertiesSelection(layer),
            fieldTypes: layer.getPropertyTypes(),
            method: state.method,
            layerType: layer.getLayerType(),
            style: state.style,
            bbox: this.instance.getSandbox().getMap().getBbox(),
            opacity: layer.getOpacity(),
            methodParams: gatherMethodParams(state, layer)
        };

        if (isTemp) {
            selections.features = [layer.getFeatureAsGeoJSON()];
        }
        if (!this.validator.validateSelections(selections)) {
            return;
        }
        // use intersect method for clip
        if (selections.method === 'clip') {
            selections.method = 'intersect';
        }
        const data = {
            analyse: JSON.stringify(selections),
            filter1: JSON.stringify(this._getFilterJSON(state.layerId))
        };

        if (state.targetId) {
            data.filter2 = JSON.stringify(this._getFilterJSON(state.targetId))
        }
        if (state.showDataWithoutSaving && METHOD_OPTIONS[state.method]?.allowNoSave) {
            data.saveAnalyse = false;
        }
        const showOptions = {
            featureData: state.showFeatureData,
            noSave: state.showDataWithoutSaving
        };
        this.instance.getAnalyseService().sendAnalyseData(data, showOptions);
    }

    _getPropertiesSelection (layer) {
        const { type, selected } = this.getState().properties;
        if (type === PROPERTIES.NONE) {
            return [];
        }
        if (type === PROPERTIES.SELECT) {
            return selected;
        }
        return getProperties(layer);
    }

    _getFilterJSON (layerId) {
        const featureIds = this.instance.getSelectionsForLayer(layerId);
        const { filter } = this.getState();
        if (filter === FILTER.BBOX || featureIds.length === 0) {
            return { bbox: this.instance.getSandbox().getMap().getBbox() };
        }
        return { featureIds };
    }
}

const wrapped = controllerMixin(Handler, [
    'setEnabled',
    'addTempLayer',
    'removeLayer',
    'showDrawHelpper',
    'openStyleEditor',
    'openAggregateResults',
    'openFlyout',
    'setAnalysisLayerId',
    'setTargetLayerId',
    'setValue',
    'setShowDataWithoutSaving',
    'setMethod',
    'setMethodParam',
    'setProperties',
    'commitAnalysis'
]);

export { wrapped as AnalysisStateHandler };
