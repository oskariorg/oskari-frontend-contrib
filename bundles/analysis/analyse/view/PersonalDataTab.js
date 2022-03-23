import React from 'react';
import ReactDOM from 'react-dom';
import {getCenter as olExtentGetCenter, getArea as olExtentGetArea} from 'ol/extent';
import { AnalysisList } from './AnalysisList';

/**
 * @class Oskari.mapframework.bundle.analyse.view.PersonalDataTab
 * Renders the analysis tab content to be shown in "personal data" bundle.
 * Also handles the delete functionality it provides in the UI.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.analyse.view.PersonalDataTab',

    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance}
     * instance
     *      reference to component that created the tile
     */
    function (instance) {
        var me = this,
            p;

        me.instance = instance;
        me.loc = Oskari.getMsg.bind(null, 'Analyse');
        me.container = undefined;

        /* templates */
        me.template = {};
        for (p in me.__templates) {
            if (me.__templates.hasOwnProperty(p)) {
                me.template[p] = jQuery(me.__templates[p]);
            }
        }
    }, {
        __templates: {
            main: '<div class="oskari-analysis-listing-tab"></div>'
        },
        /**
         * Returns reference to a container that should be shown in personal data
         * @method getContent
         * @return {jQuery} container reference
         */
        getContent: function () {
            if (this.container) {
                return this.container;
            }
            // construct it
            var me = this;

            me.container = me.template.main.clone();
            // populate initial grid content
            me.update();
            return me.container;
        },

        /**
         * @method handleBounds
         * @private
         *
         * Make use of the layer bounding box information to set appropriate map view
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
         *            layer layer for which to handle bounds
         *
         */
        handleBounds: function (layer) {
            var sandbox = this.instance.sandbox;
            var geom = layer._geometry;

            if ((geom === null) || (typeof geom === 'undefined')) {
                return;
            }
            if (geom.length === 0) {
                return;
            }

            var olPolygon = geom[0];
            var extent = olPolygon.getExtent();
            var center = olExtentGetCenter(extent);
            var area = olExtentGetArea(extent);
            var epsilon = 1.0;
            var rb = Oskari.requestBuilder('MapMoveRequest');
            var req;
            if (area < epsilon) {
                // zoom to level 9 if a single point
                req = rb(center.x, center.y, 9);
                sandbox.request(this.instance, req);
            } else {
                var bounds = {left: extent[0], bottom: extent[1], right: extent[2], top: extent[3]};
                req = rb(center.x, center.y, bounds);
                sandbox.request(this.instance, req);
            }
        },

        /**
         * Updates the tab content with current analysis layers listing
         * @method update
         */
        update: function () {
            var me = this,
                service = me.instance.sandbox.getService(
                    'Oskari.mapframework.service.MapLayerService'
                ),
                layers = service.getAllLayersByMetaType('ANALYSIS');

            ReactDOM.render(
                <AnalysisList
                    data={layers}
                    handleDelete={(item) => me.deleteAnalysis(item)}
                    openAnalysis={(item) => me.openAnalysis(item)}
                />
                ,
                me.container[0]
            )
        },
        /**
         * @method deleteAnalysis
         * Request backend to delete analysis data for the layer. On success removes the layer
         * from map and layerservice. On failure displays a notification.
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer analysis data to be destroyed
         * @param {Boolean} should success dialog be shown or not. Optional, if not set, dialog is shown.
         */
        deleteAnalysis: function (layer, showDialog) {
            var me = this,
                tokenIndex = layer._id.lastIndexOf('_') + 1, // parse actual id from layer id
                idParam = layer._id.substring(tokenIndex);

            jQuery.ajax({
                url: Oskari.urls.getRoute('DeleteAnalysisData'),
                data: {
                    id: idParam
                },
                type: 'POST',
                success: function (response) {
                    if (response && response.result === 'success') {
                        me._deleteSuccess(layer, showDialog);
                    } else {
                        me._deleteFailure();
                    }
                },
                error: function () {
                    me._deleteFailure();
                }
            });
        },
        openAnalysis: function (layer) {
            const me = this;
            const addMLrequestBuilder = Oskari.requestBuilder('AddMapLayerRequest');
            const sandbox = me.instance.sandbox;
            sandbox.request(me.instance, addMLrequestBuilder(layer._id));
            me.handleBounds(layer);
        },
        /**
         * Success callback for backend operation.
         * @method _deleteSuccess
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer layer that was removed
         * @param {Boolean} should success dialog be shown or not. Optional, if not set, dialog is shown.
         * @private
         */
        _deleteSuccess: function (layer, showDialog) {
            var sandbox = this.instance.sandbox;
            var service = sandbox.getService('Oskari.mapframework.service.MapLayerService');
            // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
            // also we need to do it before service.remove() to avoid problems on other components
            var removeMLrequestBuilder = Oskari.requestBuilder('RemoveMapLayerRequest');
            sandbox.request(this.instance, removeMLrequestBuilder(layer._id));
            service.removeLayer(layer._id);
            // show msg to user about successful removal
            if (showDialog) {
                var dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                );
                dialog.show(
                    this.loc('personalDataTab.notification.deletedTitle'),
                    this.loc('personalDataTab.notification.deletedMsg')
                );
                dialog.fadeout(3000);
            }
        },
        /**
         * Failure callback for backend operation.
         * @method _deleteFailure
         * @private
         */
        _deleteFailure: function () {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = dialog.createCloseButton(this.loc('personalDataTab.buttons.ok'));
            dialog.show(this.loc('personalDataTab.error.title'), this.loc('personalDataTab.error.generic'), [okBtn]);
        }
    });
