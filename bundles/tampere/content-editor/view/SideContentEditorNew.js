import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import olFormatWKT from 'ol/format/WKT';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import { LocaleProvider } from 'oskari-ui/util';
import * as olProj from 'ol/proj';
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
        var me = this;
        me.layerGeometries = null;
        me.layerGeometryType = null;
        me.sandbox = instance.sandbox;
        me.instance = instance;
        me.loc = localization;
        me.templates = {
            wrapper: '<div></div>',
            getinfoResultTable: '<table class="getinforesult_table"></table>',
            tableRow: '<tr></tr>',
            tableCell: '<td></td>',
            tableInput: '<input />',
            header: '<div class="getinforesult_header"><div class="icon-bubble-left"></div>',
            headerTitle: '<div class="getinforesult_header_title"></div>',
            linkOutside: '<a target="_blank"></a>',
            templateGuide: jQuery('<div><div class="guide"></div>' +
                    '<div class="buttons">' +
                    '<div class="cancel button"></div>' +
                    '<div class="finish button"></div>' +
                    '</div>' +
                    '</div>'),
            templateHelper: jQuery(
                '<div class="drawHelper">' +
                    '<div class="infoText"></div>' +
                    '<div class="measurementResult"></div>' +
                    '</div>'
            ),
            deleteDialog: jQuery('<div id="delete-dialog">' +
                    '<div>' + me.loc.deleteGeometryDialog.text + '</div>' +
                '</div>')
        };
        me.template = jQuery(
            '<div class="content-editor">' +
            '  <div class="header">' +
            '    <div class="icon-close">' +
            '    </div>' +
            '    <h3></h3>' +
            '  </div>' +
            '  <div class="content">' +
            '  </div>' +
            '</div>');
        me.allVisibleLayers = [];
        me.allLayers = null;
        me.mainPanel = null;
        me.isLayerVisible = true;
        me.mapLayerService = me.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        me.selectedLayerId = null;
        me.drawPlugin = null;
        me.operationMode = null;
        me.drawToolType = null;
        me.clickCoords = null;
        me.drawingActive = false;
        me.currentEditFeatureFid = null;
        me.allClickedFeatures = [];
        me.fieldsTypes = [];
        me.featureDuringEdit = false;
        me.processGFIRequest = true;
        me.GFIFirstRequestProcessed = false;
        me.highlightFeaturesIds = [];
        me.editMultipleFeaturesButton = null;
        me.editMultipleFeatures = false;
        me.defaultClickDistanceThreshold = 0.05;
        me._geojson = null;
        me.templateFeatureMarkup = null;


        Oskari.makeObservable(this);
        this.on('loading', () => this.update());
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
            this.layerId = layerId;
            this.loading = true;
            // Oskari.getSandbox().postRequestByName('ContentEditor.ShowContentEditorRequest', [2662])
            Oskari.getSandbox().postRequestByName('AddMapLayerRequest', [layerId]);
            this.trigger('loading', this.loading);
            Helper.describeLayer(layerId).then(metadata => {
                this.loading = false;
                this._currentLayer.geometryType = metadata.geometryType;
                this._currentLayer.fieldTypes = metadata.types;
                this.trigger('layer.metadata', { id: layerId });
                this.trigger('loading', this.loading);
                // these are deprecated:
                this.layerGeometryType = metadata.geometryType;
                // NOTE! types are a bit different now
                this.fieldsTypes = metadata.types;
                //this._addDrawTools();
            }).catch((error) => {
                // TODO: 
                console.log(error);
                this.loading = false;
                this.trigger('loading', this.loading);
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
            this.update();
            // oldRender()
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




        /**
         * Starts drawing, sends a StartDrawingRequest with given params. Changes the panel controls to match the application state (new/edit)
         * @method @public startNewDrawing
         */
        startNewDrawing: function () {
            const drawParams = {
                allowMultipleDrawing: true,
                showMeasureOnMap: true
            };
            const geometry = this.allClickedFeatures
                .filter(feat => feat.fid === this.currentEditFeatureFid)
                .map(feat => feat.geometry)
                .shift();
            if (typeof geometry !== 'undefined') {
                // editing something
                if (this.layerGeometryType.indexOf('Multi') > -1) {
                    drawParams.allowMultipleDrawing = 'multiGeom';
                } else {
                    drawParams.allowMultipleDrawing = 'single';
                }
                var format = new olFormatGeoJSON();
                drawParams.geojson = format.writeGeometry(geometry);
            }
            this.sandbox.postRequestByName('DrawTools.StartDrawingRequest',
                [this.DRAW_OPERATION_ID, this.getDrawToolsGeometryType(), drawParams]);
        },

        //TODO: make this one better to also include handling of GeometryPropertyType
        /**
         * Gets drawtool geometry type
         * @method @public getDrawToolsGeometryType
         * @return {String}    drawtools geometry type
         */
        getDrawToolsGeometryType: function () {
            return this.layerGeometryType.replace('Multi', '');
        },

        /**
         * Sends a StopDrawingRequest.
         * @method @public sendStopDrawRequest
         */
        sendStopDrawRequest: function () {
            DrawingHelper.stopDrawing();
        },

        /**
         * Sets geometry type
         * @method @public setGeometryType
         * @param  {String}        geometryType geometry type
         */
        setGeometryType: function (geometryType) {
            this.layerGeometryType = Helper.detectGeometryType(geometryType);
        },

        /**
         * Parse WFS feature geometries
         * @method @public parseWFSFeatureGeometries
         * @param  {Oskari.mapframework.bundle.mapwfs2.event.WFSFeatureGeometriesEvent}                  evt event
         */
        parseWFSFeatureGeometries: function (evt) {
            const eventFeature = evt.getFeatures()[0];
            var layerFound = this.allVisibleLayers.some((layer) => layer.getId() == eventFeature.layerId);

            if (!layerFound) {
                // Not handle event
                return;
            }
            eventFeature.geojson.features.forEach((feature) => this._addClickedFeature(feature));
        },

        /**
         * Find geometry by fid
         * @method  _findGeometryByFid
         * @param   {String}           fid feature identifier
         * @return  {Object}               clicked feature object, like {id:0, geometry:geom}
         * @private
         */
        _findGeometryByFid: function (fid) {
            var me = this;
                
            for (var i = 0; i < this.allClickedFeatures.length; i++) {
                if (this.allClickedFeatures[i].fid == fid) {
                    return this.allClickedFeatures[i];
                }
                else {
                    var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                    okButton.setTitle(me.loc.buttons.ok);
                    var dialog = {};
                    dialog.header = me.loc.findGeometryByFid.header;
                    dialog.error = me.loc.findGeometryByFid.error;
                    okButton.setHandler(function () {
                        me.closeDialog();
                    });
                    me.showMessage(dialog.header, dialog.error, [okButton]);
                }
            }
        },
        /**
         * Add clicked feature
         * @method  _addClickedFeature
         * @param   {Object}           clickedFeature clicked feature
         * @private
         */
        _addClickedFeature: function (clickedFeature) {
            var me = this;
            var gjson= new olFormatGeoJSON();
            var geometry = gjson.readGeometry(clickedFeature.geometry);
            if (me.allClickedFeatures.length > 0) {
                var isNewFeature = true;
                for (var i = 0; i < me.allClickedFeatures.length; i++) {
                    if (me.allClickedFeatures[i].fid == clickedFeature.id) {
                        isNewFeature = false;
                        me.allClickedFeatures[i].geometry = geometry;
                    }
                }
                if (isNewFeature == true) {
                    me.allClickedFeatures.push({fid: clickedFeature.id, geometry: geometry});
                }
            } else {
                me.allClickedFeatures.push({fid: clickedFeature.id, geometry: geometry});
            }
        },

        /**
         * Add new feature
         * @method  _addNewFeature
         * @private
         */
        _addNewFeature: function () {
            var me = this;
            if (me.selectedLayerId) {
                me._removeHighligh(me.selectedLayerId);
            }
            me.getLayerGeometryType();
            me.sendStopDrawRequest(true);
            var layer = me._getLayerById(me.layerId);
            var fields = layer.getFields().slice();
            var featureData = [[]];
            fields.forEach(function () {
                featureData[0].push('');
            });

            me._handleInfoResult({layerId: me.layerId, features: featureData}, 'create');
        },
        /**
         * Edit feature
         * @method  _editFeature
         * @param   {String}     fid feature identifier
         * @private
         */
        _editFeature: function (fid) {
            var me = this;
            me._handleInfoResult(me.currentData, 'edit', fid);

            var geometry = me._findGeometryByFid(fid);
            if (geometry != null) {
                me.layerGeometries = geometry;
            }
            me.setGeometryType(me.layerGeometries.geometry.getType());
            me._addDrawTools();
            me.currentEditFeatureFid = fid;
        },

        /**
         * Edit multiple feautures
         * @method  _editMultipleFeatures
         * @param   {String}              fid feature identifier
         * @private
         */
        _editMultipleFeatures: function (fid) {
            var me = this;
            var geometry = me._findGeometryByFid(fid);
            if (geometry != null) {
                me.layerGeometries = geometry;
            }
            me.setGeometryType(me.layerGeometries.geometry.id);
            jQuery.each(me.templateFeatureMarkup[0].rows || [], function(index, el) {
                var element = jQuery(el);
                jQuery.each(el.cells ||[], function(i, cell) {
                    var cellEl = jQuery(cell);
                    if(i > 0) {
                        var input = cellEl.find('input');
                        if(input.length > 0) {
                            input.addClass('template-feature');
                            input.val('');
                            input.attr('data-default', '');
                            input.off('blur.modifyMultipleFeatures');
                        } else {
                            cellEl.text('');
                        }
                    } else if(cellEl.text() === '__fid') {
                        element.hide();
                    }
                });
            });
            var saveMultipleFeaturesButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveMultipleFeaturesButton.setTitle(me.loc.buttons.save);
            saveMultipleFeaturesButton.setHandler(function () {
                var thisInput = jQuery(this);
                var yesButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                yesButton.setTitle(me.loc.buttons.yes);
                yesButton.setHandler(function () {
                    var templateInputs = jQuery('input.template-feature');
                    // Set multiple feature data to all editable feature fields
                    // Used later for when gathering data
                    jQuery.each(templateInputs || [], function(key, value) {
                        var input = jQuery(value);

                        if(input.val()) {
                            var dataKey = input.data('key');
                            var newValue = input.val();
                            var elements = jQuery('.getinforesult_table td[data-key='+dataKey+']');

                            // Set multiple feature data to single feature data
                            jQuery.each(elements || [], function () {
                                jQuery(this).text(newValue);
                            });
                        }
                    });
                    me.closeDialog();
                    me._saveFeature();
                });
                var noButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                noButton.setTitle(me.loc.buttons.no);
                noButton.setHandler(function () {
                    me.closeDialog();
                });
                me.showMessage(me.loc.modifyMultipleFeaturesConfirmation.title, me.loc.modifyMultipleFeaturesConfirmation.text, [yesButton, noButton]);
            });
            var cancelMultipleFeaturesButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelMultipleFeaturesButton.setTitle(me.loc.buttons.cancel);
            cancelMultipleFeaturesButton.setHandler(function () {
                jQuery('.content-editor-multiple').empty();
                jQuery('.content-editor-multiple-buttons').empty();
            });
            var buttonsContainer = jQuery('<div/>').addClass('content-editor-multiple-buttons').addClass('content-editor-buttons');
            saveMultipleFeaturesButton.insertTo(buttonsContainer);
            cancelMultipleFeaturesButton.insertTo(buttonsContainer);
            jQuery('.properties-container').prepend(buttonsContainer);
            var editorContainer = jQuery('<div/>').addClass('content-editor-multiple');
            editorContainer.html(me.templateFeatureMarkup);
            jQuery('.properties-container').prepend(editorContainer);
        },

        /**
         * Shows new feature unsaved modal message
         * @method  _showAddUnsavedInfoModal
         * @private
         */
        _showAddUnsavedInfoModal: function () {
            var me = this;
            var saveButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveButton.setTitle(me.loc.buttons.save);
            saveButton.setPrimary(true);
            saveButton.setHandler(function () {
                me.closeDialog();
                me._saveFeature();
                me._addNewFeature();
            });
            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelButton.setTitle(me.loc.buttons.cancel);
            cancelButton.setHandler(function () {
                me.closeDialog();
                me._addNewFeature();
            });
            me.showMessage(me.loc.unsavedChanges.title, me.loc.unsavedChanges.text, [saveButton, cancelButton], true);
        },

        /**
         * Shows edit feature unsaved modal message
         * @method  _showEditUnsavedInfoModal
         * @param   {String}                  fid feature identifier
         * @private
         */
        _showEditUnsavedInfoModal: function (fid) {
            var me = this;
            var saveButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            saveButton.setTitle(me.loc.buttons.save);
            saveButton.setPrimary(true);
            saveButton.setHandler(function () {
                me.closeDialog();
                me._saveFeature();
                me._editFeature(fid);
            });
            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelButton.setTitle(me.loc.buttons.cancel);
            cancelButton.setHandler(function () {
                me.closeDialog();
                me._editFeature(fid);
            });
            me.showMessage(me.loc.unsavedChanges.title, me.loc.unsavedChanges.text, [saveButton, cancelButton], true);
        },
        
        oldRender: function () {
            var me = this,
                content = me.template.clone();
            
            me.mainPanel = content;

            me._addDrawTools(content);

            content.find('.content').append(jQuery('<div />').addClass('properties-container'));

            if (!me._checkLayerVisibility(me.layerId)) {
                me.isLayerVisible = false;
                me._changeLayerVisibility(me.layerId, true);
            }
            me._hideOtherVectorLayers(this.getCurrentLayer().id);
            me._disableGFI();
        },

        /**
         * Gets layer geometry type and adds supported drawtools
         * @method @public getLayerGeometryType
         */
        getLayerGeometryType: function () {
            // /action?action_route=GetWFSLayerFields&layer_id=3324
            // {"geometryName":"geom","types":{"nimi":"string","numero":"number","id":"number","teksti":"string"},"geometryType":"MultiPointPropertyType"}
            var me = this;
            jQuery.ajax({
                type: 'GET',
                data: {'layer_id': me.layerId},
                dataType: 'text',
                url: Oskari.urls.getRoute('GetWFSLayerGeometryType'),
                success: function (response) {
                    me.layerGeometryType = Helper.detectGeometryType(response);
                    me._addDrawTools();
                }
            });
        },


        /**
         * Get linestring
         * @method  _getLineString
         * @param   {Array}       coordinates coordinates array
         * @return  {Array}       linestring object array, example [{x:1,y:1},{x:2,y:2}]
         * @private
         */
        _getLineString: function (coordinates) {
            var line = [];
            coordinates.forEach(function (coord) {
                line.push({x: coord[0], y: coord[1]});
            });
            return line;
        },

        /**
         * Gets edited layer geometries
         * @method  _getEditedGeometries
         * @private
         */
        _getEditedGeometries: function () {
            var me = this;
            var geometries = {
                type: '',
                data: []
            };

            var fillGeometries = function (geom) {
                if (geom != null) {
                    if (geom.type === 'MultiPoint') {
                        geometries.type = 'multipoint';
                        geom.coordinates.forEach(function (coordinates) {
                            geometries.data.push({x: coordinates[0], y: coordinates[1]});
                        });
                    } else if (geom.type == 'MultiLineString') {
                        geometries.type = 'multilinestring';

                        geom.coordinates.forEach(function (coordinates) {
                            geometries.data.push(me._getLineString(coordinates));
                        });
                    } else if (geom.type == 'MultiPolygon') {
                        geometries.type = 'multipolygon';

                        geom.coordinates.forEach(function (coordinates) {
                            var tmpPolygon = [];

                            coordinates.forEach(function (lineCoordinates) {
                                tmpPolygon.push(me._getLineString(lineCoordinates));
                            });

                            geometries.data.push(tmpPolygon);
                        });
                    } else if (geom.type == 'Point') {
                        var tmp = [];
                        geometries.type = 'multipoint';
                        geometries.data.push({x: geom.coordinates[0], y: geom.coordinates[1]});

                    } else if (geom.type == 'LineString') {
                        geometries.type = 'multilinestring';
                        geometries.data.push(me._getLineString(geom.coordinates));

                    } else if (geom.type == 'Polygon') {
                        var tmp = [];
                        geometries.type = 'multipolygon';
                        geom.coordinates.forEach(function (coordinates) {
                            coordinates.forEach(function (lineCoordinates) {
                                tmp.push({x:lineCoordinates[0], y:lineCoordinates[1]});
                            });
                        });
                        geometries.data.push([tmp]);
                    }
                }
            };

            var hasCreatedGeoJSON = function () {
                return (me._geojson && me._geojson.features[0] && me._geojson.features[0].geometry) ? true : false;
            };

            if (this.operationMode == 'edit' && hasCreatedGeoJSON() ) {
                me._geojson.features.forEach(function(feature) {
                    fillGeometries(feature.geometry);
                });
            } else if(this.operationMode == 'edit' && me.layerGeometries != null && me.layerGeometries.geometry != null) {
                    var type = me.layerGeometries.geometry.getType();
                    var coordinates = me.layerGeometries.geometry.getCoordinates();

                    var geoms = {
                        type: type,
                        coordinates: coordinates,
                        data: []
                    };
                    fillGeometries(geoms);
            } else if (this.operationMode == 'create' && hasCreatedGeoJSON() ) {
                me._geojson.features.forEach(function(feature) {
                    fillGeometries(feature.geometry);
                });

            }

            return geometries;

        },

        /**
         * Sends save/insert/delete feature ajax request
         * @method @public sendRequest
         * @param  {Object}    requestData   request data
         * @param  {Boolean}    deleteFeature is delete feature
         */
        sendRequest: function (requestData, deleteFeature) {
            var overlay = Oskari.clazz.create('Oskari.userinterface.component.Overlay');
            overlay.overlay('body');
            overlay.followResizing(true);
            var spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
            spinner.insertTo('body');
            spinner.start();

            var me = this,
                okButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
                url = null,
                wfsLayerPlugin = me.sandbox.findRegisteredModuleInstance('MainMapModule').getPluginInstances('WfsLayerPlugin');

            okButton.setTitle(me.loc.buttons.ok);

            if (me.operationMode === 'create' && !me.editMultipleFeatures) {
                url = Oskari.urls.getRoute('InsertFeature');
            } else  {
                url = Oskari.urls.getRoute('SaveFeature');
            }

            var dialog = {};
            if (deleteFeature == true) {
                dialog.header = me.loc.geometryDelete.header;
                dialog.success = me.loc.geometryDelete.success;
                dialog.error = me.loc.geometryDelete.error;
            } else if(me.editMultipleFeatures) {
                dialog.header = me.loc.multipleFeaturesUpdate.header;
                dialog.success = me.loc.multipleFeaturesUpdate.success;
                dialog.error = me.loc.multipleFeaturesUpdate.error;
            } else {
                dialog.header = me.loc.featureUpdate.header;
                dialog.success = me.loc.featureUpdate.success;
                dialog.error = me.loc.featureUpdate.error;
            }
            me._geojson = null;

            jQuery.ajax({
                type: 'POST',
                data : {'featureData': JSON.stringify(requestData)},
                url: url,
                success: function (response) {
                    spinner.stop();
                    overlay.close();
                    me.editMultipleFeaturesButton.setEnabled(false);
                    me.editMultipleFeatures = false;
                    if (me.operationMode === 'create' && !me.editMultipleFeatures) {
                        me.currentData.features[0][0] = response.fid;
                    }

                    me._clearFeaturesList();
                    var layer = me._getLayerById(me.layerId);
                    me._removeHighligh(me.layerId);
                    //TODO: deleteTileCache  does nothing atm
                    //wfsLayerPlugin.deleteTileCache(me.layerId, layer.getCurrentStyle().getName());

                    // Style not changed, but need to be send anyway so at geometries edit shows
                    var evt = Oskari.eventBuilder('AfterChangeMapLayerStyleEvent')(layer);
                    me.sandbox.notifyAll(evt);

                    me.sendStopDrawRequest(true);

                    okButton.setHandler(function () {
                        setTimeout(function() {
                            var visibilityRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerUpdateRequest'),
                                request = visibilityRequestBuilder(me.layerId, true);
                            me.sandbox.request(me.instance.getName(), request);
                        }, 500);
                        me.closeDialog();
                    });

                    if(response.messageKey) {
                        me.showMessage(dialog.header, me.loc.messages[response.messageKey], [okButton]);
                    } else {
                        me.showMessage(dialog.header, dialog.success, [okButton]);
                    }
                    me.clickedGeometryNumber = null;
                },
                error: function (error) {
                    spinner.stop();
                    overlay.close();
                    me.editMultipleFeaturesButton.setEnabled(false);
                    me.editMultipleFeatures = false;
                    okButton.setHandler(function () {
                        me.closeDialog();
                    });
                    me.showMessage(dialog.header, dialog.error, [okButton]);
                    me.sendStopDrawRequest(true);
                }
            });
        },

        /**
         * Sets current geojson (when drawtool finished)
         * @method setCurrentGeoJson
         * @param  {Object}          geojson
         */
        setCurrentGeoJson: function (geojson) {
            this._geojson = geojson;
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
         * Prepare request
         * @method prepareRequest
         * @param  {Boolean}     deleteFeature delete geometry ?
         */
        prepareRequest: function (deleteFeature) {
            var me = this;
            me.sendRequest(me._getRequestData(deleteFeature), deleteFeature);
        },

        /**
         * Destroys/removes this view from the screen.
         * @method @public destroy
         */
        destroy: function () {
            var me = this;
            me.sendStopDrawRequest(true);
            me._restoreLayersHiddenByEditor();

            var gfiActivationRequestBuilder = Oskari.requestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            var request = gfiActivationRequestBuilder(true);
            me.sandbox.request(me.instance.getName(), request);

            if (!me.isLayerVisible) {
                me._changeLayerVisibility(me.layerId, false);
            }
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
         * Checks at is layer visible
         * @method  _checkLayerVisibility
         * @param   {[type]}              layerId [description]
         * @return  {[type]}                      [description]
         * @private
         */
        _checkLayerVisibility: function (layerId) {
            var me = this;
            var layer = me._getLayerById(layerId);
            if (layer.isVisible()) {
                return true;
            }
            return false;
        },

        /**
         * Change layer visibility
         * @method  _changeLayerVisibility
         * @param   {String}            layerId    layer id
         * @param   {Boolean}           isVisible is visible
         * @private
         */
        _changeLayerVisibility: function (layerId, isVisible) {
            var me = this;

            var visibilityRequestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
            var request = visibilityRequestBuilder(layerId, isVisible);
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
         * Handle info results
         * @method  _handleInfoResult
         * @param   {Object}          data               layer data
         * @param   {String}          mode               operation mode
         * @param   {String}          editableFeatureFid feature identifier
         * @private
         */
        _handleInfoResult: function (data, mode, editableFeatureFid) {
            var me = this;
            var i;

            if (me.operationMode === 'delete') {
                me._handleDeleteGeometry();
                return;
            }

            if (mode === 'create') {
                this.operationMode = 'create';
            } else if (mode === 'edit') {
                this.operationMode = 'edit';
            } else {
                this.operationMode = null;
            }

            var layer = this._getLayerById(data.layerId);
            if (editableFeatureFid === undefined) {
                this.layerGeometryType = null;
                this._addDrawTools();
            }

            if (!me.processGFIRequest) {
                if (me.GFIFirstRequestProcessed == true) {
                    me.getLayerGeometryType();
                    return;
                } else {
                    me.GFIFirstRequestProcessed = true;
                }
            }

            me.highlightFeaturesIds = [];
            if (data.features) {
                const isEditIdUnknown = editableFeatureFid === undefined;
                for (i = 0; i < data.features.length; i++) {
                    const currentId = data.features[i].__fid
                    if ((isEditIdUnknown || currentId == editableFeatureFid)
                        && data.features[i] != '') {
                            me.highlightFeaturesIds.push(currentId.split('.')[1]);
                    }
                }
            }

            var isVisibleLayer = this.allVisibleLayers.some(layer => layer.getId() == data.layerId);
            if (!isVisibleLayer) {
                return;
            }

            this.selectedLayerId = data.layerId;
            this.currentData = data;

            var content = [],
                contentData = {},
                fragments = [];

            me.mainPanel.find('.content-draw-tools').removeClass('hide');
            fragments = this._formatWFSFeaturesForInfoBox(data, editableFeatureFid);

            me.mainPanel.find('.properties-container').empty();
            if (fragments != null && fragments.length) {
                if(fragments.length > 1) {
                    me.editMultipleFeaturesButton.setEnabled(true);
                    me.editMultipleFeaturesButton.setHandler(function () {
                        me.editMultipleFeatures = true;
                        jQuery.each(fragments || [], function(key, value) {
                            if(key === 0) {
                               me._editMultipleFeatures(value.fid);
                            }
                        });
                    });
                } else {
                    me.editMultipleFeaturesButton.setEnabled(false);
                }
                contentData.html = this._renderFragments(fragments, editableFeatureFid);
                contentData.layerId = fragments[0].layerId;
                contentData.layerName = fragments[0].layerName;
                contentData.featureId = data.features[0][0];
                content.push(contentData);
                me.mainPanel.find('.properties-container').append(contentData.html);
                me._setDatepickerLanguage();
                me.mainPanel.find('.datepicker').datepicker({'dateFormat': 'yy-mm-dd', 'changeMonth': true, 'changeYear': true, 'showButtonPanel': true}).attr('readonly', 'readonly');
            } else {
                me.editMultipleFeaturesButton.setEnabled(false);
            }
        },

        /**
         * Formats WFS features  for infobox
         * @method  _formatWFSFeaturesForInfoBox
         * @param   {Object}                     data               data
         * @param   {String}                     editableFeatureFid editable feature identifier
         * @return  {Object}                     input object
         * @private
         */
        _formatWFSFeaturesForInfoBox: function (data, editableFeatureFid) {
            var me = this,
                layer = this.sandbox.findMapLayerFromSelectedMapLayers(data.layerId),
                fields = layer.getFields().slice(),
                hiddenFields = ['__centerX', '__centerY'],
                type = 'wfslayer',
                result,
                markup;

            if (data.features === 'empty' || layer === null || layer === undefined) {
                return;
            }

            if (fields.length === 0) { // layer view is empty, get fields from DescribeFeatureType
                fields = ['__fid'];
                jQuery.each(me.fieldsTypes, function (key, value) {
                    if (value.indexOf('gml:') !== 0) { // skip geometry
                        fields.push(key);
                    }
                });
                fields = fields.concat(['__centerX', '__centerY']);
            }

            // replace fields with locales
            fields = _.chain(fields)
                .zip(layer.getLocales().slice())
                .map(function (pair) {
                    // pair is an array [field, locale]
                    if (_.contains(hiddenFields, _.first(pair))) {
                        // just return the field name for now if it's hidden
                        return _.first(pair);
                    }
                    // return the localized name or field if former is undefined
                    return _.last(pair) || _.first(pair);
                })
                .value();

            result = _.map(data.features, function (feature) {
                var feat = _.chain(fields)
                    .zip(feature)
                    .filter(function (pair) {
                        return !_.contains(hiddenFields, _.first(pair));
                    })
                    .foldl(function (obj, pair) {
                        if (pair[0] !== undefined) {
                            obj[_.first(pair)] = _.last(pair);
                        }
                        return obj;
                    }, {})
                    .value();

                markup = me._json2html(feat, ((editableFeatureFid != undefined && feat.__fid === editableFeatureFid) || me.operationMode == 'create' ? false : true));
                var retObj = {
                    markup: markup,
                    layerId: data.layerId,
                    layerName: layer.getLayerName(),
                    type: type,
                    fid: feat.__fid
                };

                me.templateFeatureMarkup = me._json2html(feat, false);
                return retObj;
            });

            return result;
        },

        /**
         * Parses and formats a WFS layers JSON GFI response
         * @method _json2html
         * @private
         * @param {Object} node response data to format
         * @return {String} formatted HMTL
         */
        _json2html: function (node, readonly) {
            var me = this;
            if (typeof readonly === 'undefined') {
                readonly = false;
            }

            if (node === null || node === undefined) {
                return '';
            }
            var html = jQuery(this.templates.getinfoResultTable),
                row = null,
                keyColumn = null,
                valColumn = null,
                key,
                value;

            for (key in node) {
                if (node.hasOwnProperty(key)) {
                    value = node[key];

                    if (key === null || key === undefined) {
                        continue;
                    }
                    row = jQuery(this.templates.tableRow);

                    keyColumn = jQuery(this.templates.tableCell);
                    keyColumn.append(key);
                    row.append(keyColumn);

                    valColumn = jQuery(this.templates.tableCell);
                    if (key == '__fid' || readonly) {
                        valColumn.append(value);
                        valColumn.attr('data-key', key);
                    } else {
                        var valInput = jQuery(this.templates.tableInput);
                        valInput.attr('data-key', key)
                        switch (this.fieldsTypes[key]) {
                        case 'xsd:numeric':
                            valInput.prop('type', 'number');
                            valInput.on('blur', function (event) {
                                if (jQuery.isNumeric(jQuery(this).val()) == false) {
                                    jQuery(this).addClass('field-invalid');

                                    var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                    okButton.setTitle(me.loc.buttons.ok);
                                    okButton.setHandler(function () {
                                        me.closeDialog();
                                    });
                                    me.showMessage(me.loc.formValidationNumberError.title, me.loc.formValidationNumberError.text, [okButton]);
                                }
                            });
                            valInput.on('keyup', function (event) {
                                if (jQuery.isNumeric(jQuery(this).val())) {
                                    jQuery(this).removeClass('field-invalid');
                                }
                            });
                            break;
                        case 'xsd:double':
                        case 'xsd:decimal':
                            valInput.prop('type', 'number').prop('step', 0.01);
                            valInput.on('blur', function (event) {
                                if (jQuery.isNumeric(jQuery(this).val()) == false) {
                                    jQuery(this).addClass('field-invalid');

                                    var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                    okButton.setTitle(me.loc.buttons.ok);
                                    okButton.setHandler(function () {
                                        me.closeDialog();
                                    });
                                    me.showMessage(me.loc.formValidationNumberError.title, me.loc.formValidationNumberError.text, [okButton]);
                                }
                            });
                            valInput.on('keyup', function (event) {
                                if (jQuery.isNumeric(jQuery(this).val())) {
                                    jQuery(this).removeClass('field-invalid');
                                }
                            });
                            break;
                        case 'xsd:date':
                            valInput.prop('type', 'text');
                            valInput.addClass('datepicker');
                            break;
                        case 'xsd:string':
                        default:
                            valInput.prop('type', 'text');
                            break;
                        }
                        // If multiple features are modified at the same time, add also blur for modifying those values.
                        if(me.editMultipleFeatures) {
                            valInput.on('blur.modifyMultipleFeatures', function(event){
                                var thisInput = jQuery(this);
                                var yesButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                yesButton.setTitle(me.loc.buttons.yes);
                                yesButton.setHandler(function () {
                                    var key = thisInput.data('key');
                                    var newValue = thisInput.val();
                                    var elements = jQuery('.getinforesult_table td[data-key='+key+']');
                                    jQuery.each(elements || [], function(key, value){
                                        jQuery(value).text(newValue);
                                    });
                                    me.closeDialog();
                                });
                                var noButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                noButton.setTitle(me.loc.buttons.no);
                                noButton.setHandler(function () {
                                    thisInput.val(thisInput.attr('data-default'));
                                    thisInput.text(thisInput.attr('data-default'));
                                    me.closeDialog();
                                });
                                me.showMessage(me.loc.modifyMultipleFeaturesConfirmation.title, me.loc.modifyMultipleFeaturesConfirmation.text, [yesButton, noButton]);
                            });
                        }
                        valInput.val(value);
                        valInput.on('change', function () {
                            me.featureDuringEdit = true;
                        });
                        valColumn.append(valInput);
                    }
                    row.append(valColumn);
                    html.append(row);
                }
            }
            return html;
        },

        /**
         * Handles save feature
         * @method  _saveFeature
         * @private
         */
        _saveFeature: function () {
            var me = this;
            if (me._formIsValid()) {
                if (me.drawingActive == true) {
                    me.drawingActive = false;
                    me.sendStopDrawRequest();
                }

                me.prepareRequest(false);
                me.featureDuringEdit = false;
                me._storeFormData();
            } else {
                var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                okButton.setTitle(me.loc.buttons.ok);
                okButton.setHandler(function () {
                    me.closeDialog();
                });
                me.showMessage(me.loc.formValidationError.title, me.loc.formValidationError.text, [okButton], true);
            }
        },

        /**
         * Handles cancel feature
         * @method  _cancelFeature
         * @private
         */
        _cancelFeature: function () {
            var me = this;
            me.drawingActive = false;
            me.sendStopDrawRequest(true);
            me._clearFeaturesList();
            me.featureDuringEdit = false;
            me.editMultipleFeaturesButton.setEnabled(false);
            me.editMultipleFeatures = false;
        },

        /**
         * Stores filled form data
         * @method  _storeFormData
         * @private
         */
        _storeFormData: function () {
            var me = this;
            me.mainPanel.find('.getinforesult_table tr input').each(function (index) {
                me.currentData.features[0][index + 1] = jQuery(this).val();
            });
        },

        /**
         * Wraps the html feature fragments into a container.
         *
         * @method _renderFragments
         * @private
         * @param  {Object[]} fragments
         * @return {jQuery}
         */
        _renderFragments: function (fragments, editableFeatureFid) {
            var me = this;

            return _.foldl(fragments, function (wrapper, fragment) {
                var fragmentTitle = fragment.layerName,
                    fragmentMarkup = fragment.markup;

                if (fragment.isMyPlace) {
                    if (fragmentMarkup) {
                        wrapper.append(fragmentMarkup);
                    }
                } else {
                    var contentWrapper = jQuery(me.templates.wrapper),
                        headerWrapper = jQuery(me.templates.header),
                        titleWrapper = jQuery(me.templates.headerTitle),
                        actionButtonWrapper = jQuery(me.templates.wrapper);

                    titleWrapper.append(fragmentTitle);
                    titleWrapper.attr('title', fragmentTitle);

                    if (editableFeatureFid === fragment.fid || me.operationMode == 'create') {
                        var saveButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        saveButton.setPrimary(true);
                        saveButton.setTitle(me.loc.buttons.save);
                        saveButton.setHandler(function () {
                            me._saveFeature();
                            me._enableGFIRequestProcess();
                        });

                        var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        cancelButton.setTitle(me.loc.buttons.cancel);
                        cancelButton.setHandler(function () {
                            me._cancelFeature();
                            me._enableGFIRequestProcess();
                            me._removeHighligh(me.selectedLayerId);
                        });
                        var drawToolsContainer = jQuery('<div/>').addClass('content-draw-tools');
                        drawToolsContainer.append(me._addDrawTools());
                        contentWrapper.append(drawToolsContainer);

                        var buttonsContainer = jQuery('<div/>').addClass('content-editor-buttons');
                        saveButton.insertTo(buttonsContainer);
                        cancelButton.insertTo(buttonsContainer);

                        contentWrapper.append(buttonsContainer);
                    }
                    headerWrapper.append(titleWrapper);
                    contentWrapper.append(headerWrapper);
                    contentWrapper.addClass('getinforesult_container');

                    if (fragmentMarkup) {
                        contentWrapper.append(fragmentMarkup);
                    }

                    if (fragment.fid != editableFeatureFid && me.operationMode != 'create') {
                        var deleteButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        deleteButton.setTitle(me.loc.buttons.deleteFeature);
                        deleteButton.setHandler(function () {
                            var deleteButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                            deleteButton.setTitle(me.loc.buttons.delete);
                            deleteButton.setPrimary(true);
                            deleteButton.setHandler(function () {
                                me.closeDialog();
                                me._deleteFeature(fragment.fid);
                            });
                            var cancelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                            cancelButton.setTitle(me.loc.buttons.cancel);
                            cancelButton.setHandler(function () {
                                me.closeDialog();
                                me._enableGFIRequestProcess();
                            });
                            me.showMessage(me.loc.deleteFeature.title, me.loc.deleteFeature.text, [deleteButton, cancelButton], true);
                        });

                        var editButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                        editButton.setTitle(me.loc.buttons.editFeature);
                        editButton.setHandler(function () {
                            me.processGFIRequest = false;
                            if (me.featureDuringEdit) {
                                me.featureDuringEdit = false;
                                me._showEditUnsavedInfoModal(fragment.fid);
                            } else {
                                me._editFeature(fragment.fid);
                            }
                        });

                        editButton.insertTo(actionButtonWrapper);
                        deleteButton.insertTo(actionButtonWrapper);
                        actionButtonWrapper.addClass('content-editor-buttons');
                        contentWrapper.append(actionButtonWrapper);
                    } else {
                        contentWrapper.addClass('edit-feature');
                    }

                    wrapper.append(contentWrapper);
                }

                delete fragment.isMyPlace;

                return wrapper;
            }, jQuery(me.templates.wrapper));
        },

        /**
         * Gathers form data
         * @method  _gatherFormData
         * @return  {Array}  multiarray array of form objects [{key:key, value:val}]
         * @private
         */
        _gatherFormData: function () {
            var results = [];

            var me = this;
            me.mainPanel.find('div.getinforesult_container table.getinforesult_table').each(function (){
                var result = {
                    featureId: null,
                    data: []
                };

                jQuery(this).find('tr').each(function () {
                    var key = jQuery(this).find('td').eq(0).html();
                    var val = null;
                    if (jQuery(this).find('td').eq(1).find('input').length > 0) {
                        val = jQuery(this).find('td').eq(1).find('input').val();
                    } else {
                        val = jQuery(this).find('td').eq(1).text();
                    }

                    if (key === '__fid') {
                        result.featureId = val;
                    }
                    else if (me.operationMode === 'create' && val !== '') {
                        result.data.push({ key: key, value: val });
                    } else if (me.operationMode !== 'create') {
                        result.data.push({ key: key, value: val });
                    }

                });
                results.push(result);
            });

            return results;
        },

        /**
         * Adds drawtools
         * @method  _addDrawTools
         * @return {Object} tool jQuery container
         * @private
         */
        _addDrawTools: function () {
            var me = this;
            me.mainPanel.find('.content-draw-tools').empty();
            var pointButton = jQuery('<div />').addClass('add-point tool').attr('title', me.loc.tools.point);
            if (me.layerGeometryType == 'MultiPoint' || me.layerGeometryType == 'Point' || me.layerGeometryType == 'GeometryPropertyType') {
                pointButton.on('click', function () {
                    me.layerGeometryType = 'Point';
                    me.drawingActive = true;
                    me.startNewDrawing();
                });
            } else {
                pointButton.addClass('disabled');
            }
            var lineButton = jQuery('<div />').addClass('add-line tool').attr('title', me.loc.tools.line);
            if (me.layerGeometryType == 'MultiLineString' || me.layerGeometryType == 'GeometryPropertyType') {
                lineButton.on('click', function () {
                    me.layerGeometryType = 'MultiLineString';
                    me.drawingActive = true;
                    me.startNewDrawing();
                });
            } else {
                lineButton.addClass('disabled');
            }
            var areaButton = jQuery('<div />').addClass('add-area tool').attr('title', me.loc.tools.area);
            if (me.layerGeometryType == 'MultiPolygon' || me.layerGeometryType == 'Polygon' || me.layerGeometryType == 'GeometryPropertyType') {
                areaButton.on('click', function () {
                    me.layerGeometryType = 'Polygon';
                    me.drawingActive = true;
                    me.startNewDrawing();
                });
            } else {
                areaButton.addClass('disabled');
            }
            var geomEditButton = jQuery('<div />').addClass('selection-area tool').attr('title', me.loc.tools.geometryEdit);
            if (me.layerGeometryType != null) {
                geomEditButton.on('click', function () {
                    me.drawingActive = true;
                    me.drawToolType = 'edit';
                    me.startNewDrawing();
                });
            } else {
                geomEditButton.addClass('disabled');
            }

            var geomDeleteButton = jQuery('<div />').addClass('selection-remove tool').attr('title', me.loc.tools.remove);

            if (me.operationMode === 'create') {
                geomDeleteButton.addClass('disabled');
            } else {
                geomDeleteButton.on('click', function () {
                    me.sendStopDrawRequest(true);
                    me.operationMode = 'delete';
                });
            }

            var toolContainer = jQuery('<div />').addClass('toolrow');
            toolContainer.append(pointButton);
            toolContainer.append(lineButton);
            toolContainer.append(areaButton);
            toolContainer.append(geomEditButton);
            toolContainer.append(geomDeleteButton);
            me.mainPanel.find('.content-draw-tools').append(toolContainer);
            return toolContainer;
        },

        /**
         * Returns the zoom based click tolerance threshold.
         * @method  @private _getZoomBasedClickToleranceThreshold
         * @return {Number} the tolerance
         */
        _getZoomBasedClickToleranceThreshold: function () {
            var me = this,
                zoom = me.sandbox.getMap().getZoom(),
                zoomBasedClickToleranceThreshold;
            switch (zoom) {
            case 1:
                zoomBasedClickToleranceThreshold = 6.9;
                break;
            case 2:
                zoomBasedClickToleranceThreshold = 3.34;
                break;
            case 3:
                zoomBasedClickToleranceThreshold = 1.79;
                break;
            case 4:
                zoomBasedClickToleranceThreshold = 0.808;
                break;
            case 5:
                zoomBasedClickToleranceThreshold = 0.405;
                break;
            case 6:
                zoomBasedClickToleranceThreshold = 0.202;
                break;
            case 7:
                zoomBasedClickToleranceThreshold = 0.111;
                break;
            case 8:
                zoomBasedClickToleranceThreshold = 0.05;
                break;
            case 9:
                zoomBasedClickToleranceThreshold = 0.0247;
                break;
            case 10:
                zoomBasedClickToleranceThreshold = 0.01338;
                break;
            case 11:
                zoomBasedClickToleranceThreshold = 0.0061;
                break;
            case 12:
                zoomBasedClickToleranceThreshold = 0.00335;
                break;
            case 13:
                zoomBasedClickToleranceThreshold = 0.00152;
                break;
            case 14:
                zoomBasedClickToleranceThreshold = 0.000881;
                break;
            case 15:
                zoomBasedClickToleranceThreshold = 0.00038;
                break;
            default:
                zoomBasedClickToleranceThreshold = me.defaultClickDistanceThreshold;
            }
            return zoomBasedClickToleranceThreshold;
        },

        /**
         * Sets clicked coodrinates
         * @method setClickCoords
         * @param  {Array}       coords coordiantes array
         */
        setClickCoords: function (coords) {
            this.clickCoords = coords;
        },

        /**
         * Remove highlight
         * @method  _removeHighligh
         * @param   {String}           layerId layer id
         * @private
         */
        _removeHighligh: function (layerId) {
            var me = this;
            var eventBuilder = Oskari.eventBuilder('WFSFeaturesSelectedEvent');
            if (eventBuilder) {
                var event = eventBuilder([], me._getLayerById(layerId), true);
                this.sandbox.notifyAll(event);
            }
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
            var wfsLayerPlugin = me.sandbox.findRegisteredModuleInstance('MainMapModule').getPluginInstances('WfsLayerPlugin');

            var okButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
            okButton.setTitle(me.loc.buttons.ok);

            jQuery.ajax({
                type: 'POST',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
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
         * Gets feature geometry index
         * @method  _getFeatureGeometryIndex
         * @param   {String}          geometryType geometry type, supported are: MultiPoint, MultiPolygon, MultiLineString
         * @return  {Integer}         geometry index
         * @private
         */
        _getFeatureGeometryIndex: function (geometryType) {
            var me = this;
            var clickedCoordsWGS84 = olProj.transform([me.clickCoords.x, me.clickCoords.y], me.sandbox.getMap()._projectionCode, 'EPSG:4326');
            if (geometryType.indexOf('Multi') === -1) {
                // only supports MultiGeometries
                return -1;
            }

            var clickedTurfPoint = turf.point(clickedCoordsWGS84);

            // Get MultiPolygon geometry index
            if (geometryType === 'MultiPolygon') {
                return me.layerGeometries.geometry.getPolygons().findIndex(function (polygon) {
                    return polygon.containsXY(me.clickCoords.x, me.clickCoords.y);
                });
            }

            // Get MultiPoint geometry index
            if (geometryType === 'MultiPoint') {
                return me.layerGeometries.geometry.getPoints().findIndex(function (point) {
                    var coords = point.getCoordinates();
                    var coordWGS84 = olProj.transform(coords, me.sandbox.getMap()._projectionCode, 'EPSG:4326');
                    var from = turf.point(coordWGS84);
                    var distance = turf.distance(from, clickedTurfPoint);
                    return distance <= me._getZoomBasedClickToleranceThreshold();
                });
            }

            // Get MultiLineString geometry index
            if (geometryType === 'MultiLineString') {
                return me.layerGeometries.geometry.getLineStrings().findIndex(function (lineString) {
                    var lineStringCoords = lineString.getCoordinates();
                    var lineStringTransformed = [];
                    for (var k = 0; k < lineStringCoords.length; ++k) {
                        var lineStringPoint = lineStringCoords[k];
                        var lineStringPointWGS84 = olProj.transform(lineStringPoint, me.sandbox.getMap()._projectionCode, 'EPSG:4326');
                        lineStringTransformed.push(lineStringPointWGS84);
                    }
                    var line = turf.lineString(lineStringTransformed);
                    // Get default distance
                    var distance = turf.pointToLineDistance(clickedTurfPoint, line);
                    return distance <= me._getZoomBasedClickToleranceThreshold();
                });
            }
        },

        /**
         * Handle delete geometry
         * @method  _handleDeleteGeometry
         * @private
         */
        _handleDeleteGeometry: function () {
            var me = this;

            var type = me.layerGeometries.geometry.getType();
            var featureGeometryIndex = me._getFeatureGeometryIndex(type);

            if (featureGeometryIndex !== -1) {
                var contentActions = [];

                // Cancel button
                var cancelButton = {
                    name: me.loc.buttons.cancel,
                    type: 'button',
                    group: 1,
                    action: function () {
                        var request = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest')('contentEditor');
                        me.sandbox.request(me, request);
                    }
                };
                contentActions.push(cancelButton);

                // Delete button
                var deleteButton = {
                    name: me.loc.buttons.delete,
                    type: 'button',
                    group: 1,
                    action: function () {
                        var newCoords = [];
                        me.layerGeometries.geometry.getCoordinates().forEach(function (coords, index) {
                            if (index !== featureGeometryIndex) {
                                newCoords.push(coords);
                            }
                        });

                        me.layerGeometries.geometry.setCoordinates(newCoords);
                        me.prepareRequest(true);
                        var request = Oskari.requestBuilder('InfoBox.HideInfoBoxRequest')('contentEditor');
                        me.sandbox.request(me, request);
                        me._enableGFIRequestProcess();
                    }
                };
                contentActions.push(deleteButton);

                var content = [{
                    html: me.templates.deleteDialog.clone(),
                    actions: contentActions
                }];

                var options = {
                    hidePrevious: true
                };
                var request = Oskari.requestBuilder('InfoBox.ShowInfoBoxRequest')('contentEditor', me.loc.deleteGeometryDialog.title, content, {lon: me.clickCoords.x, lat: me.clickCoords.y}, options);
                me.sandbox.request(me.getName(), request);
            }
            me.operationMode = 'edit';
        },

        /**
         * Clear features list
         * @method  _clearFeaturesList
         * @private
         */
        _clearFeaturesList: function () {
            var me = this;
            me.mainPanel.find('.properties-container').empty();
        },

        /**
         * Checks at form is valid
         * @method  _formIsValid
         * @return  {Boolean}     is valid?
         * @private
         */
        _formIsValid: function () {
            var me = this;
            if (me.mainPanel.find('.properties-container input.field-invalid').length > 0) {
                return false;
            }
            return true;
        },

        /**
         * Sets datepicker language
         * @method  _setDatepickerLanguage
         * @private
         */
        _setDatepickerLanguage: function () {
            var storedLanguage = jQuery.cookie('oskari.language');
            var lang = null;
            if (storedLanguage == null) {
                var supportedLanguages = Oskari.getSupportedLanguages();
                lang = 'en-GB';
                for (var i = 0; i < supportedLanguages.length; i++) {
                    if (supportedLanguages[i].indexOf('en') > -1) {
                        break;
                    }

                    if (supportedLanguages[i].indexOf('fi') > -1) {
                        lang = 'fi';
                        break;
                    }
                }
            } else {
                lang = storedLanguage;
            }

            jQuery.datepicker.setDefaults(
                jQuery.extend(
                    jQuery.datepicker.regional[lang],
                    {'dateFormat': 'yy-mm-dd'}
                )
            );
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
