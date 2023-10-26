import olFormatGeoJSON from 'ol/format/GeoJSON';
import { getDrawRequestType } from '../service/AnalyseHelper';

const STYLE = {
    draw: {
        fill: {
            color: 'rgba(35,216,194,0.3)'
        },
        stroke: {
            color: 'rgba(35,216,194,1)',
            width: 2
        },
        image: {
            radius: 4,
            fill: {
                color: 'rgba(35,216,194,0.7)'
            }
        }
    },
    modify: {
        fill: {
            color: 'rgba(0,0,238,0.3)'
        },
        stroke: {
            color: 'rgba(0,0,238,1)',
            width: 2
        },
        image: {
            radius: 4,
            fill: {
                color: 'rgba(0,0,0,1)'
            }
        }
    }
};

const DRAW_OPTIONS = {
    allowMultipleDrawing: 'multiGeom',
    showMeasureOnMap: true,
    style: STYLE
};
const DRAW_ID = 'analyseDrawLayer';

Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.view.DrawControls',
    function (instance, mapModule) {
        this.instance = instance;
        this.sandbox = this.instance.getSandbox();
        this.mapModule = mapModule;
        this.loc = this.instance.loc;
        this.eventHandlers = {};
        this.storeDrawing = false;
    }, {
        /**
         * @static @property _templates
         */
        _templates: {
            toolContainer: '<div class="toolContainer">' +
                '  <h4 class="title"></h4>' +
                '</div>',
            tool: '<div class="tool"></div>'
        },
        getName: function () {
            return this.instance.getName() + 'DrawControls';
        },
        stop: function () {
            this.closeHelpDialog();
            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.unregisterFromEventByName(this, p));
        },
        start: function () {
            this.eventHandlers = this.createEventHandlers();
        },
        createEventHandlers: function () {
            const handlers = {
                'DrawingEvent': (event) => this.drawingHandler(event)
            };
            Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
            return handlers;
        },
        drawingHandler: function (event) {
            if (event.getId() !== DRAW_ID || !this.storeDrawing || !event.getIsFinished()) {
                return;
            }
            // 'multiGeom' -> gathers drawn shapes into a single feature
            const feature = new olFormatGeoJSON().readFeatures(event.getGeoJson())[0];
            this.instance.getStateHandler().addTempLayer({feature});
            this._stopDrawing(true);
        },
        onEvent: function (e) {
            var handler = this.eventHandlers[e.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [e]);
        },

        /**
         * Creates and returns the draw buttons from which the user can draw
         * temporary features which can be used in analysis.
         *
         * @method createDrawButtons
         * @return {jQuery}
         */
        createDrawButtons: function () {
            const toolContainer = jQuery(this._templates.toolContainer).clone();
            const toolTemplate = jQuery(this._templates.tool);
            const tools = ['point', 'line', 'area'];

            toolContainer.find('h4').html(this.loc('AnalyseView.content.features.title'));

            tools.forEach(tool => {
                const toolDiv = toolTemplate.clone();
                toolDiv.addClass('add-' + tool);
                toolDiv.attr('title', this.loc(`content.features.tooltips.${tool}`));
                toolDiv.on('click', () => {
                    const drawType = getDrawRequestType(tool);
                    this.sandbox.postRequestByName('DrawTools.StartDrawingRequest', [DRAW_ID, drawType, DRAW_OPTIONS]);
                    this.showDrawHelpper(tool);
                });
                toolContainer.append(toolDiv);
            });
            return toolContainer;
        },
        showDrawHelpper: function (tool) {
            this.closeHelpDialog();

            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            dialog.addClass('analyse-draw-dialog');
            const title = this.loc(`AnalyseView.content.drawDialog.${tool}.title`);
            const text = this.loc(`AnalyseView.content.drawDialog.${tool}.add`);

            const cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
            cancelBtn.setHandler(() => {
                this._stopDrawing(true);
                this.closeHelpDialog();
            });
            const finishBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            finishBtn.setTitle(this.loc('AnalyseView.content.features.buttons.finish'));
            finishBtn.setPrimary(true);
            finishBtn.setHandler(() => {
                this._stopDrawing();
                this.closeHelpDialog();
            });

            dialog.show(title, text, [cancelBtn, finishBtn]);
            dialog.moveTo('.tool.add-' + tool, 'bottom');
            this.helpDialog = dialog;
        },
        _stopDrawing: function (isCancel = false) {
            this.storeDrawing = !isCancel;
            this.sandbox.postRequestByName('DrawTools.StopDrawingRequest', [DRAW_ID, isCancel, isCancel]);
        },

        closeHelpDialog: function () {
            if (this.helpDialog) {
                this.helpDialog.close(true);
                this.helpDialog = null;
            }
        }
    }
);
