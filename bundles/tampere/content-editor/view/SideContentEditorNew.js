import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'oskari-ui/util';
import { Helper } from './Helper';
import { SidePanel } from './SidePanel';
import { DrawingHelper } from './DrawingHelper';

/**
 * @class Oskari.tampere.bundle.content-editor.view.SideContentEditor
 */
Oskari.clazz.define('Oskari.tampere.bundle.content-editor.view.SideContentEditor',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance} instance
     * Reference to component that created this view
     * @param {Object} localization
     * Localization data in JSON format
     * @param {string} layerId
     */
    function (instance, localization, layerId) {
        this.sandbox = instance.sandbox;
        this.instance = instance;
        this.loc = localization;
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');

        Oskari.makeObservable(this);
        this.loading = false;
        this.on('loading', (newValue) => {
            this.loading = newValue;
            this.update();
        });
        this.on('update', () => this.update());
        this.setCurrentLayer(layerId)
    }, {
        DRAW_OPERATION_ID: 'ContentEditor',
        __name: 'ContentEditor',
        /**
         * @method @public getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        setCurrentLayer: function (layerId) {
            this._currentLayer = {
                id: layerId
            };
            // Oskari.getSandbox().postRequestByName('ContentEditor.ShowContentEditorRequest', [2662])
            Oskari.getSandbox().postRequestByName('AddMapLayerRequest', [layerId]);
            this.trigger('loading', true);
            Helper.describeLayer(layerId).then(metadata => {
                this._currentLayer.geometryType = metadata.geometryType;
                this._currentLayer.fieldTypes = metadata.types;
                this.trigger('layer.metadata', { id: layerId });
                this.trigger('loading', false);
            }).catch(() => {
                // error is shown on side panel if we didn't get
                //  the geometryType for layer so we don't need to handle it here
                this.trigger('loading', false);
            });
        },
        getCurrentLayer: function () {
            return this._currentLayer;
        },
        editFeature: function (geojson) {
            this.setCurrentFeature(geojson);
            this.update();
        },
        setCurrentFeature: function (feature) {
            this._feature = feature;
        },
        getCurrentFeature: function () {
            return this._feature;
        },

        setElement: function (rootEl) {
            this._el = rootEl;
        },
        getElement: function () {
            return this._el;
        },
        /**
         * Renders view to given DOM element
         * @method @public render
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            this.setElement(container);
            this._disableGFI();
            this.update();
        },
        update: function () {
            const el = this.getElement();
            if (!el) {
                return;
            }
            ReactDOM.render(
                <LocaleProvider value={{ bundleKey: 'ContentEditor' }}>
                    <SidePanel
                        loading={this.loading}
                        layer={this.getCurrentLayer()}
                        feature={this.getCurrentFeature()}
                        onSave={(feature) => this.saveFeature(feature)}
                        onClose={() => this.instance.setEditorMode(false)}
                        onCancel={() => this.stopEditing()}
                        startNewFeature={() => this.startNewFeature()}
                    />
                </LocaleProvider>, el);
        },
        stopEditing: function () {
            this.editFeature(undefined);
        },
        startNewFeature: function () {
            this.editFeature({
                type: 'Feature',
                properties: {}
            });
        },
        saveFeature: function (feature) {
            this.stopEditing();
            const isNew = typeof feature.id === 'undefined';
            const url = Oskari.urls.getRoute('VectorFeatureWriter', {
                layerId: this.getCurrentLayer().id,
                crs: Oskari.getSandbox().getMap().getSrsName()
            });
            console.log('Call:', url, 'with', feature);
            // remove _oid from properties
            const {_oid, ...rest} = feature.properties
            const payload = {
                ...feature,
                properties: {
                    ...rest
                }
            };
            fetch(url, {
                method: isNew ? 'POST': 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(response => {
                if (!response.ok) {
                    return Promise.reject(Error('Save failed'));
                }
                return response.json();
            }).then(data => {
                console.log(data);
                setTimeout(() => {
                    me.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [this.getCurrentLayer().id, true]);
                }, 500);
            }).catch(error => console.log(error));
        },

        /**
         * Sends a StopDrawingRequest.
         * @method @public sendStopDrawRequest
         */
        sendStopDrawRequest: function () {
            DrawingHelper.stopDrawing();
        },

        /**
         * Sends save/insert/delete feature ajax request
         * @method @public sendRequest
         * @param  {Object}    requestData   request data
         * @param  {Boolean}    deleteFeature is delete feature
         */
        sendRequest: function (requestData, deleteFeature) {

            if (me.operationMode === 'create' && !me.editMultipleFeatures) {
                url = Oskari.urls.getRoute('InsertFeature');
            } else  {
                url = Oskari.urls.getRoute('SaveFeature');
            }


            jQuery.ajax({
                type: 'POST',
                data : {'featureData': JSON.stringify(requestData)},
                url: url,
                success: function (response) {
                },
                error: function (error) {
                }
            });
        },

        /**
         * Get request data
         * @method  _getRequestData
         * @return  {JSONArray}  gathered edited data
         * @private
         */
        _getRequestData: function (deleteFeature) {
            var me = this;
            var data = null;

            var getSingleData = function () {
                // single feature has only  one form data
                var gatheredData = me._gatherFormData()[0];

                var feature = {
                    featureFields: gatheredData.data,
                    featureId: gatheredData.featureId,
                    layerId: me.selectedLayerId,
                    srsName: me.sandbox.getMap().getSrsName()
                };

                if (!me.editMultipleFeatures && (me.operationMode == 'edit' || me.operationMode == 'create' || deleteFeature == true)) {
                    feature.geometries = me._getEditedGeometries();
                }
                return [feature];
            };

            var getMultipleEditData = function () {
                var gatheredData = me._gatherFormData();
                var features = [];

                gatheredData.forEach(function (fields) {
                    var feature = {
                        featureFields: fields.data,
                        featureId: fields.featureId,
                        layerId: me.selectedLayerId,
                        srsName: me.sandbox.getMap().getSrsName()
                    };

                    features.push(feature);

                });

                return features;
            };


            // single edit
            if (!me.editMultipleFeatures) {
                data = getSingleData();
            }
            // multiple edit
            else if (me.editMultipleFeatures) {
                data = getMultipleEditData();
            }

            return data;
        },

        /**
         * Destroys/removes this view from the screen.
         * @method @public destroy
         */
        destroy: function () {
            var me = this;
            me.sendStopDrawRequest(true);
            me._restoreLayersHiddenByEditor();

            me.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [true]);

            this.getElement().remove();
        },

        /**
         * Removes temporarily layers from map that the user cant publish
         * @method _hideOtherVectorLayers
         * @private
         */
         _hideOtherVectorLayers: function (currentLayerId) {
            const visibleSelectedLayers = this.sandbox.findAllSelectedMapLayers().filter(layer => layer.isVisible());
            this.allVisibleLayers = visibleSelectedLayers;
            // hide other WFS layers that are visible on the map
            visibleSelectedLayers
                .filter(layer => layer.getId() !== currentLayerId)
                .filter(layer => layer.isLayerOfType('WFS'))
                .forEach(layer => this._changeLayerVisibility(layer.getId(), false));
        },

        /**
         * Change all visibled layers visible
         * @method  _showLayers
         * @private
         */
        _restoreLayersHiddenByEditor: function () {
            this.allVisibleLayers
                .forEach((layer) => this._changeLayerVisibility(layer.getId(), true));
        },

        /**
         * Disable GFI
         * @method  _disableGFI
         * @private
         */
        _disableGFI: function () {
            var me = this;
            var gfiActivationRequestBuilder = Oskari.requestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            var request = gfiActivationRequestBuilder(false);
            me.sandbox.request(me.instance.getName(), request);
        },

        /**
         * Get layers by id
         * @method  _getLayerById
         * @param   {String}      layerId layer id
         * @return  {Object}      layer object
         * @private
         */
        _getLayerById: function (layerId) {
            var me = this;
            return me.sandbox.findMapLayerFromAllAvailable(layerId);
        },


        /**
         * Delete feature
         * @method  _deleteFeature
         * @param   {String}       fid feuture identifier
         * @private
         */
        _deleteFeature: function (fid) {
            var me = this;

            var requestData = {};
            requestData.layerId = me.selectedLayerId;
            requestData.featureId = fid;

            var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okButton.setTitle(me.loc.buttons.ok);

            jQuery.ajax({
                type: 'POST',
                data: {'featureData': JSON.stringify(requestData)},
                url: Oskari.urls.getRoute('DeleteFeature'),
                success: function (response) {
                    me._clearFeaturesList();
                    // remove old tiles
                    var layer = me._getLayerById(me.selectedLayerId);
                    me._removeHighligh(me.selectedLayerId);
                    //TODO: deleteTileCache  does nothing atm
                    //wfsLayerPlugin.deleteTileCache(me.selectedLayerId, layer.getCurrentStyle().getName());
                    var evt = Oskari.eventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                    me.sandbox.notifyAll(evt);
                    okButton.setHandler(function () {
                        setTimeout(function () {
                            var visibilityRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerUpdateRequest');
                            var request = visibilityRequestBuilder(me.selectedLayerId, true);
                            me.sandbox.request(me.instance.getName(), request);
                        }, 500);
                        me.closeDialog();
                    });
                    me.showMessage(me.loc.featureDelete.header, me.loc.featureDelete.success, [okButton]);
                },
                error: function (error) {
                    okButton.setHandler(function () {
                        me.closeDialog();
                    });
                    me.showMessage(me.loc.featureDelete.header, me.loc.featureDelete.error, [okButton]);
                }
            });
        },

        /**
         * Enable GFI request process
         * @method  _enableGFIRequestProcess
         * @private
         */
        _enableGFIRequestProcess: function () {
            var me = this;
            me.processGFIRequest = true;
            me.GFIFirstRequestProcessed = false;
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    });
