import { showTerrainPopup } from './view/TerrainPopup';
import { Messaging } from 'oskari-ui/util';
import './MarkerHandler.js';
import './resources/css/terrainprofile.css';

Oskari.clazz.define('Oskari.mapframework.bundle.terrain-profile.TerrainProfileBundleInstance',
    function () {
        this.active = false;
        this.feature = null;
        this.popupControls = null;
        this.loc = Oskari.getMsg.bind(null, 'TerrainProfile');

        function requestFunction (requestName, args) {
            var builder = Oskari.requestBuilder(requestName);
            if (!builder) {
                return false;
            }
            var request = builder.apply(null, args);
            this.sandbox.request(this, request);
            return true;
        }
        this.markerHandler = Oskari.clazz.create('Oskari.mapframework.bundle.terrain-profile.MarkerHandler', requestFunction.bind(this));
    },
    {
        __name: 'TerrainProfile',
        /**
         * @method _startImpl bundle start hook. Called from superclass start()
         * @param sandbox
         */
        _startImpl: function (sandbox) {
            var addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
            var buttonConf = {
                iconCls: 'tool-terrainprofile',
                tooltip: this.loc('terrainHeightProfile'),
                sticky: true,
                callback: function (el) { }
            };
            sandbox.request(this, addToolButtonBuilder('TerrainProfile', 'basictools', buttonConf));
        },
        closePopup: function () {
            if (this.popupControls) {
                this.popupControls.close();
            }
            this.popupControls = null;
        },
        /**
         * @method setActive controls terrain profile functionality on/off state
         * @param {Boolean} activeState should the functionality be on?
         */
        setActive: function (activeState) {
            if (activeState) {
                if (this.active) {
                    return;
                }
                this.createPopup(null, false);
                this.startDrawing();
                this.active = true;
            } else {
                if (!this.active) {
                    return;
                }
                this.active = false;
                this.stopDrawing();
                this.closePopup();
                this.feature = null;
            }
        },
        /**
         * @method cancelTool deactivate terrain profile tool
         */
        cancelTool: function () {
            var builder = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
            this.sandbox.request(this, builder());
            this.closePopup();
        },
        /**
         * @method createPopup creates UI popup for terrain profile
        */
        createPopup: function (data, loading) {
            if (!this.popupControls) {
                this.popupControls = showTerrainPopup(() => this.doQuery(), data, this.markerHandler, loading, () => this.cancelTool());
            }
        },
        /**
         * @method startDrawing starts DrawRequest drawing
         */
        startDrawing: function () {
            var builder = Oskari.requestBuilder('DrawTools.StartDrawingRequest');
            this.sandbox.request(this, builder(this.__name, 'LineString', { modifyControl: true, allowMultipleDrawing: false, showMeasureOnMap: true }));
        },
        /**
         * @method stopDrawing stops DrawRequest drawing
         */
        stopDrawing: function () {
            var builder = Oskari.requestBuilder('DrawTools.StopDrawingRequest');
            this.sandbox.request(this, builder(this.__name, true));
        },
        /**
         * @method doQuery send query to backend
         */
        doQuery: function () {
            if (!this.feature) {
                return;
            }
            this.feature.properties = { numPoints: 100 };
            var url = Oskari.urls.getRoute('TerrainProfile');
            this.showFlyout(null, true);
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                data: {
                    route: JSON.stringify(this.feature),
                    srs: this.sandbox.getMap().getSrsName()
                },
                success: (data) => {
                    this.showFlyout(data, false);
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    this.showFlyout(null, false);
                    Messaging.error(this.loc('error'));
                    Oskari.log('TerrainProfile').warn('Could not load terrain profile data: ' + errorThrown);
                }
            });
        },
        /**
         * @method showFlyout shows graph flyout
         * @param {GeoJsonFeature} data visualization data
         */
        showFlyout: function (data, loading) {
            if (this.popupControls) {
                this.popupControls.update(data, loading);
            } else {
                this.createPopup(data, loading);
            }
        },
        eventHandlers: {
            'DrawingEvent': function (event) {
                var drawId = event.getId();
                if (drawId !== this.__name || !this.active) {
                    return;
                }
                if (event.getIsFinished()) {
                    this.feature = event.getGeoJson().features[0];
                    this.doQuery();
                } else {
                    var sketch = event.getGeoJson().features[0];
                    if (!sketch || sketch.geometry.coordinates.length <= 2) {
                        this.feature = null;
                        return;
                    }
                    var feature = { type: 'Feature', geometry: { type: 'LineString' } };
                    feature.geometry.coordinates = sketch.geometry.coordinates.slice(0, sketch.geometry.coordinates.length - 1);
                    this.feature = feature;
                }
            },
            'Toolbar.ToolSelectedEvent': function (event) {
                if (event.getToolId() === 'TerrainProfile') {
                    this.setActive(true);
                } else if (event.getSticky()) {
                    this.setActive(false);
                }
            }
        }
    },
    {
        extend: ['Oskari.BasicBundle'],
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    }
);
