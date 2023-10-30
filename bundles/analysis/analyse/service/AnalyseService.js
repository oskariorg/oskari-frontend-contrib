import { Messaging } from 'oskari-ui/util';
/**
 * @class Oskari.analysis.bundle.analyse.AnalyseService
 * Methods for sending out analysis data to backend
 */
Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.service.AnalyseService',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        this.loc = instance.loc;
    }, {
        __name: 'Analyse.AnalyseService',
        __qname: 'Oskari.analysis.bundle.analyse.service.AnalyseService',

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        init: function () {

        },
        sendAnalyseData: function (data, showOptions) {
            this.sandbox.postRequestByName('ShowProgressSpinnerRequest', [true]);
            fetch(Oskari.urls.getRoute('CreateAnalysisLayer'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(response => {
                this.sandbox.postRequestByName('ShowProgressSpinnerRequest', [false]);
                if (!response.ok) {
                    console.log(response);
                    throw new Error(response.statusText); //error
                }
                return response.json();
            }).then(json => {
                const layer = Oskari.getLocalized(json.name)
                Messaging.success(this.loc('AnalyseView.success.layerAdded.message', { layer }));
                this._handleSuccess(json, showOptions);
            }).catch(error => {
                const locObj = this.loc('AnalyseView.error');
                Messaging.error(locObj[error] || locObj.saveFailed);
            });
        },
        _handleSuccess: function (layerJson, showOptions) {
            const { id, mergeLayers = [] } = layerJson;
            const { noDataCnt, featureData, noSave } = showOptions;
            if (noSave) {
                this.instance.showAggregateResultPopup(layerJson, noDataCnt);
                return;
            }
            this._addLayerToService(layerJson);
            // Add layer to the map
            this.sandbox.postRequestByName('AddMapLayerRequest', [id]);
            if (featureData) {
                this.sandbox.postRequestByName('ShowFeatureDataRequest', [id]);
            }
            // TODO: is this used anymore??
            // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
            // Remove old layers if any
            mergeLayers.forEach(layerId => this.sandbox.postRequestByName('RemoveMapLayerRequest', [layerId]));
        },

        loadAnalyseLayers: function () {
            fetch(Oskari.urls.getRoute('GetAnalysisLayers'), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            }).then(json => {
                this._handleAnalysisLayersResponse(json.analysislayers);
            }).catch((e) => {
                console.log(e);
                Messaging.error(this.loc('AnalyseView.error.loadLayersFailed'));
            });
        },
        _addLayerToService: function (layerJson, skipEvent) {
            // Create the layer model
            const layer = this.mapLayerService.createMapLayer(layerJson);
            // Add the layer to the map layer service
            this.mapLayerService.addLayer(layer);
            if (!skipEvent) {
                // notify components of added layer if not suppressed
                var evt = Oskari.eventBuilder('MapLayerEvent')(null, 'add');
                sandbox.notifyAll(evt); // add the analysis layers programmatically since normal link processing
            }
        },
        _handleAnalysisLayersResponse: function (layers = []) {
            layers.forEach(layer => this._addLayerToService(layer, true));
            if (layers.length) {
                // null as id triggers mass update
                const event = Oskari.eventBuilder('MapLayerEvent')(null, 'add');
                this.sandbox.notifyAll(event);
            }
        }
    }, {
        protocol: ['Oskari.mapframework.service.Service']
    }
);
