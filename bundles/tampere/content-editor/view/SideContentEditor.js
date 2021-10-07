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
    function (sandbox, layerId, onExit) {
        this.sandbox = sandbox;
        this.onExit = onExit;
        this.mapLayerService = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');

        Oskari.makeObservable(this);
        this.loading = false;
        this.on('loading', (newValue) => {
            this.loading = newValue;
            this._update();
        });
        this.on('update', () => this._update());
        this._setCurrentLayer(layerId)
    }, {
        __name: 'ContentEditor',
        /**
         * @method @public getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        getCurrentLayer: function () {
            return this._currentLayer;
        },
        editFeature: function (geojson) {
            this._feature = geojson;
            if (typeof geojson !== 'undefined') {
                // remove _oid (internal normalized id by Oskari) from properties
                const {_oid, ...rest} = geojson.properties
                const feature = {
                    ...geojson,
                    properties: {
                        ...rest
                    }
                };
                this._feature = feature;
            }
            this._update();
        },
        getCurrentFeature: function () {
            return this._feature;
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
            this._el = container;
            this._update();
        },
        _update: function () {
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
                        onSave={(feature) => this._saveFeature(feature)}
                        onDelete={(featureId) => this._deleteFeature(featureId)}
                        onClose={this.onExit}
                        onCancel={() => this._stopEditing()}
                        startNewFeature={() => this._startNewFeature()}
                    />
                </LocaleProvider>, el);
        },
        _setCurrentLayer: function (layerId) {
            const mapLayer = this.mapLayerService.findMapLayer(layerId);
            this._currentLayer = {
                id: layerId,
                name: mapLayer.getName(Oskari.getDefaultLanguage())
            };
            // Oskari.getSandbox().postRequestByName('ContentEditor.ShowContentEditorRequest', [2662])
            this.sandbox.postRequestByName('AddMapLayerRequest', [layerId]);
            this._hideOtherVectorLayers(layerId);
            this.trigger('loading', true);
            Helper.describeLayer(layerId).then(metadata => {
                this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [false, this.getName()]);
                this._currentLayer.geometryType = metadata.geometryType;
                this._currentLayer.fieldTypes = metadata.types;
                this.trigger('loading', false);
            }).catch(() => {
                // error is shown on side panel if we didn't get
                //  the geometryType for layer so we don't need to handle it here
                this.trigger('loading', false);
            });
        },
        _stopEditing: function () {
            this.editFeature(undefined);
        },
        _startNewFeature: function () {
            this.editFeature({
                type: 'Feature',
                properties: {}
            });
        },
        _saveFeature: function (feature) {
            const isNew = typeof feature.id === 'undefined';
            const url = Oskari.urls.getRoute('VectorFeatureWriter', {
                layerId: this.getCurrentLayer().id,
                crs: this.sandbox.getMap().getSrsName()
            });
            fetch(url, {
                method: isNew ? 'POST': 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feature)
            }).then(response => {
                if (!response.ok) {
                    return Promise.reject(Error('Save failed'));
                }
                return response.json();
            }).then(() => {
                this._stopEditing();
                setTimeout(() => {
                    this.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [this.getCurrentLayer().id, true]);
                }, 500);
            }).catch(error => console.log(error));
        },
        _deleteFeature: function (featureId) {
            const url = Oskari.urls.getRoute('VectorFeatureWriter', {
                layerId: this.getCurrentLayer().id,
                featureId,
                crs: this.sandbox.getMap().getSrsName()
            });
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (!response.ok) {
                    return Promise.reject(Error('Delete failed'));
                }
                return response.json();
            }).then(() => {
                this._stopEditing();
                setTimeout(() => {
                    this.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [this.getCurrentLayer().id, true]);
                }, 500);
            }).catch(error => console.log(error));
        },

        /**
         * Destroys/removes this view from the screen.
         * @method @public destroy
         */
        destroy: function () {
            DrawingHelper.stopDrawing();
            // Restore layers hidden when the editor was started
            this._tempHiddenLayers.forEach((layer) => this._changeLayerVisibility(layer.getId(), true));
            this._tempHiddenLayers = null;

            this.sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoActivationRequest', [true, this.getName()]);
            this.getElement().remove();
        },

        /**
         * Temporarily hides layers from map that the user isn't editing
         * @method _hideOtherVectorLayers
         * @private
         */
         _hideOtherVectorLayers: function (currentLayerId) {
            const visibleSelectedLayers = this.sandbox.findAllSelectedMapLayers().filter(layer => layer.isVisible());
            const layersToHide = visibleSelectedLayers
                .filter(layer => layer.getId() !== currentLayerId)
                .filter(layer => layer.isLayerOfType('WFS'));
            // hide other WFS layers that are visible on the map
            layersToHide.forEach(layer => this._changeLayerVisibility(layer.getId(), false));
            this._tempHiddenLayers = layersToHide;
        },

        _changeLayerVisibility: function (layerId, isVisible) {
            this.sandbox.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layerId, isVisible]);
        }
    });
