import { StateHandler, controllerMixin } from 'oskari-ui/util';
import {getCenter as olExtentGetCenter, getArea as olExtentGetArea} from 'ol/extent';

class AnalyseHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = Oskari.getSandbox();
        this.setState({
            data: [],
            loading: false
        });
        this.loc = Oskari.getMsg.bind(null, 'Analyse');
        this.service = this.instance.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        this.eventHandlers = this.createEventHandlers();
        this.refreshLayerList();
    };

    getName () {
        return 'AnalysisHandler';
    }

    refreshLayerList () {
        this.updateState({
            loading: true
        });
        const layers = this.service.getAllLayersByMetaType('ANALYSIS');
        this.updateState({
            data: layers,
            loading: false
        });
    }

    openAnalysis (id) {
        const layer = this.state.data.find(l => l.getId() === id);
        const addMLrequestBuilder = Oskari.requestBuilder('AddMapLayerRequest');
        this.sandbox.request(this.instance, addMLrequestBuilder(layer.getId()));
        this.handleBounds(layer);
    }

    deleteAnalysis (id, showDialog) {
        this.updateState({
            loading: true
        });
        const me = this;
        const layer = me.state.data.find(l => l.getId() === id);
        const tokenIndex = layer.getId().lastIndexOf('_') + 1; // parse actual id from layer id
        const idParam = layer.getId().substring(tokenIndex);

        jQuery.ajax({
            url: Oskari.urls.getRoute('DeleteAnalysisData'),
            data: {
                id: idParam
            },
            type: 'POST',
            success: function (response) {
                if (response && response.result === 'success') {
                    me.deleteSuccess(layer, showDialog);
                } else {
                    me.deleteFailure();
                }
            },
            error: function () {
                me.deleteFailure();
            }
        });
    }

    /**
     * Success callback for backend operation.
     * @method _deleteSuccess
     * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer layer that was removed
     * @param {Boolean} should success dialog be shown or not. Optional, if not set, dialog is shown.
     * @private
     */
    deleteSuccess (layer, showDialog) {
        // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
        // also we need to do it before service.remove() to avoid problems on other components
        const removeMLrequestBuilder = Oskari.requestBuilder('RemoveMapLayerRequest');
        this.sandbox.request(this.instance, removeMLrequestBuilder(layer.getId()));
        this.service.removeLayer(layer.getId());
        // show msg to user about successful removal
        if (showDialog) {
            const dialog = Oskari.clazz.create(
                'Oskari.userinterface.component.Popup'
            );
            dialog.show(
                this.loc('personalDataTab.notification.deletedTitle'),
                this.loc('personalDataTab.notification.deletedMsg')
            );
            dialog.fadeout(3000);
        }
    }

    /**
     * Failure callback for backend operation.
     * @method _deleteFailure
     * @private
     */
    deleteFailure () {
        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        const okBtn = dialog.createCloseButton(this.loc('personalDataTab.buttons.ok'));
        dialog.show(this.loc('personalDataTab.error.title'), this.loc('personalDataTab.error.generic'), [okBtn]);
    }

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
    handleBounds (layer) {
        const geom = layer.getGeometry();

        if ((geom === null) || (typeof geom === 'undefined')) {
            return;
        }
        if (geom.length === 0) {
            return;
        }

        const olPolygon = geom[0];
        const extent = olPolygon.getExtent();
        const center = olExtentGetCenter(extent);
        const area = olExtentGetArea(extent);
        const epsilon = 1.0;
        const rb = Oskari.requestBuilder('MapMoveRequest');
        let req;
        if (area < epsilon) {
            // zoom to level 9 if a single point
            req = rb(center.x, center.y, 9);
            this.sandbox.request(this.instance, req);
        } else {
            const bounds = {left: extent[0], bottom: extent[1], right: extent[2], top: extent[3]};
            req = rb(center.x, center.y, bounds);
            this.sandbox.request(this.instance, req);
        }
    }

    createEventHandlers () {
        const handlers = {
            'MapLayerEvent': (event) => {
                const operation = event.getOperation();
                if (operation === 'add' || operation === 'remove') {
                    this.refreshLayerList();
                }
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(AnalyseHandler, [
    'openAnalysis',
    'deleteAnalysis'
]);

export { wrapped as AnalysisHandler };
