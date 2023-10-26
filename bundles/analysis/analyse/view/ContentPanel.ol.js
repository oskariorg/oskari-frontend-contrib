import { createPointFeature } from '../service/AnalyseHelper';

const LAYERLIST_FILTER = 'featuredata';

const OPTION = jQuery(
`<div class="analyse_option_cont analyse_settings_cont">
  <label class="params_checklabel">
    <input type="radio" name="selectedlayer" />
    <span></span>
  </label>
</div>`);

const LAYER_ICONS = jQuery(
`<table class=layer-icons>
  <tr>
    <td>
      <div class="layer-icon layer-wfs"></div>
    </td>
    <td class="info-cell">
      <div class="layer-info icon-info"></div>
    </td>
    <td>
      <div class="icon-close"></div>
    </td>
  </tr>
</table>`);

const FILTERS = jQuery(
`<div id="bbox-selection-container">
    <div class="filter-bbox">
        <input id="analyse-filter-bbox" type="radio" name="analysis-filter-radio"  class="filter-radio" value="bbox" />
        <label for="analyse-filter-bbox"></label>
    </div>
    <div class="filter-features">
        <input id="analyse-filter-features" type="radio" name="analysis-filter-radio"  class="filter-radio" value="features" />
        <label for="analyse-filter-features"></label>
    </div>
</div>`
);

const TEMP_ICON = jQuery('<div class="icon-close analyse-temp-feature"></div>');

Oskari.clazz.define(
    'Oskari.analysis.bundle.analyse.view.ContentPanel',
    function (view) {
        this.view = view;
        this.instance = view.instance;
        this.sandbox = view.instance.getSandbox();
        this.mapModule = undefined;
        this.layersPanel = undefined;
        this.featuresPanel = undefined;
        this.loc = this.instance.loc;
        this.started = false;
        this.controller = this.instance.getStateHandler().getController();
        this.init();
    }, {

        /**
         * @method getName
         *
         *
         * @return {String}
         */
        getName: function () {
            return this.instance.getName() + 'ContentPanel';
        },

        /**
         * @method onEvent
         *
         * @param  {Oskari.Event} event
         *
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (handler) {
                return handler.apply(this, [event]);
            }
        },

        /**
         * @method init
         * Initializes the class.
         * Creates draw plugin and feature layer and sets the class/instance variables.
         *
         * @param  {Oskari.analysis.bundle.analyse.view.StartAnalyse} view
         *
         */
        init: function () {
            this.mapModule = this.sandbox.findRegisteredModuleInstance('MainMapModule');
            this.drawControls = Oskari.clazz.create('Oskari.analysis.bundle.analyse.view.DrawControls', this.instance, this.mapModule);
        },
        start: function () {
            // Already started so nothing to do here
            if (this.isStarted) {
                return;
            }

            const handlers = {
                'WFSFeaturesSelectedEvent': () => this._toggleEmptySelection()
            };
            Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
            this.eventHandlers = handlers;

            const searchRequest = 'Search.AddSearchResultActionRequest';
            if (this.sandbox.hasHandler(searchRequest)) {
                const link = this.loc('AnalyseView.content.search.resultLink');
                const builder = Oskari.requestBuilder(searchRequest);
                const request = builder(link, this._getSearchResultAction(), this);
                this.sandbox.request(this.instance, request);
            }
            this.drawControls.start();

            this.instance.getStateHandler().addStateListener(state => this.refreshContent(state));
            this.start = true;
        },
        refreshContent: function (state) {
            const container = this.layersPanel.getContainer().find('div.layers');
            container.empty();
            const layers = this.controller.getLayers();
            layers.forEach(layer => {
                const option = OPTION.clone();
                const layerId = layer.getId();
                const name = layer.getName();
                const isTemp = state.tempLayers.includes(layer);
                const onRemove = isTemp
                    ? () => this.controller.removeTempLayer(layerId)
                    : () => this.sandbox.postRequestByName('RemoveMapLayerRequest', [layerId]);
                const input = option.find('input');
                if (layerId ===  state.layerId) {
                    input.prop('checked', true);
                }
                input.on('change', () => this.controller.setAnalysisLayerId(layerId));
                option.find('span').attr('title', name).text(name);

                const icons = isTemp ? TEMP_ICON.clone() : LAYER_ICONS.clone();
                icons.find('div.icon-close').on('click', onRemove);

                const uuid = layer.getMetadataIdentifier();
                if (uuid) {
                    icons.find('div.layer-info').on('click', () => this.instance.getSandbox().postRequestByName('catalogue.ShowMetadataRequest',  [{ uuid }]));
                } else {
                    icons.find('td.info-cell').remove();
                }

                option.append(icons);
                container.append(option);
            });
        },

        addPanelsTo: function (accordion) {
            const layersPanel = this.createLayersPanel();
            accordion.addPanel(layersPanel);
            layersPanel.open();

            const featuresPanel = this.createFeaturesPanel();
            accordion.addPanel(featuresPanel);
            featuresPanel.open();

            this.layersPanel = layersPanel;
            this.featuresPanel = featuresPanel;
        },
        /**
         * Creates the content layer selection panel for analyse
         *
         * @method createLayersPanel
         * @private
         * @return {Oskari.userinterface.component.AccordionPanel}
         *         Returns the created panel
         */
        createLayersPanel: function () {
            const panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            const container = panel.getContainer();
            const layers = jQuery('<div class="layers"></div>');
            const title = this.loc('AnalyseView.content.tooltip');
            const tooltip = jQuery(`<div class="help icon-info header-icon-info" title="${title}"></div>`);

            panel.setTitle(this.loc('AnalyseView.content.label'));
            panel.getHeader().append(tooltip);
            container.append(layers);
            container.append(this.createLayersButtons());

            return panel;
        },

        createLayersButtons: function () {
            const buttons = jQuery('<div class="buttons"></div>');

            const addBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            addBtn.setTitle(this.loc('AnalyseView.buttons.data'));
            addBtn.setPrimary(true);
            addBtn.setHandler(() => this.sandbox.postRequestByName('ShowFilteredLayerListRequest', [LAYERLIST_FILTER, true]));
            addBtn.insertTo(buttons);

            const searchBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            searchBtn.setTitle(this.loc('AnalyseView.content.search.title'));
            searchBtn.setPrimary(true);
            searchBtn.setHandler(() => {
                const extension = {
                    getName: () => 'Search'
                };
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [extension, 'attach']);
            });
            searchBtn.insertTo(buttons);

            return buttons;
        },
        createFeaturesPanel: function () {
            const panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            const tooltip = this.loc('AnalyseView.content.selectionToolsTooltip');
            const tooltipCont = jQuery(`<div class="help icon-info header-icon-info" title="${tooltip}"></div>`);
            const hasSelections = this.instance.getSelectionsForLayer().length > 0;

            panel.setTitle(this.loc('AnalyseView.content.selectionToolsLabel'));
            panel.getHeader().append(tooltipCont);
            const container = panel.getContainer();

            if (this.drawControls) {
                container.append(this.drawControls.createDrawButtons());
            }
            const label = this.loc('AnalyseView.content.selectionTools.title');
            const filterContainer = jQuery(`<div class="toolContainer"><h4 class="title">${label}</h4></div>`);
            filterContainer.append(FILTERS.clone());
            const bbox = filterContainer.find('.filter-bbox');
            bbox.find('label').text(this.loc('AnalyseView.content.selectionTools.filter.bbox'));
            bbox.find('input').on('change', () => this.controller.setFilter('bbox'));
            const features = filterContainer.find('.filter-features');
            features.find('label').text(this.loc('AnalyseView.content.selectionTools.filter.features'));
            features.find('input').on('change', () => this.controller.setFilter('features'));
            const selected = hasSelections ? features : bbox;
            selected.find('input').prop('checked', true);
            container.append(filterContainer);

            const emptyBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            emptyBtn.setHandler(() => this.instance.emptySelections());
            emptyBtn.setTitle(this.loc('AnalyseView.content.selectionTools.button.empty'));
            emptyBtn.insertTo(container);

            emptyBtn.setEnabled(hasSelections);

            return panel;
        },

        /**
         * @method destroy
         * Destroys the created components and unsets the class/instance variables.
         *
         *
         */
        destroy: function () {
            this.stop();

            this.view = undefined;
            this.instance = undefined;
            this.sandbox = undefined;
            this.loc = undefined;
            this.mapModule = undefined;
            this.layersPanel = undefined;
            this.featuresPanel = undefined;
        },

        /**
         * @public @method stop
         * Removes the feature layer, stops the draw plugin and
         * restarts all other draw plugins.
         *
         *
         */
        stop: function () {
            // Already stopped so nothing to do here
            if (!this.isStarted) {
                return;
            }

            Object.getOwnPropertyNames(this.eventHandlers).forEach(p => this.sandbox.unregisterFromEventByName(this, p));

            this.drawControls.stop();
            const requestName = 'Search.RemoveSearchResultActionRequest';
            if (this.sandbox.hasHandler(requestName)) {
                const link = this.loc('AnalyseView.content.search.resultLink');
                const builder = Oskari.requestBuilder(requestName);
                const request = builder(link);
                this.sandbox.request(this.instance, request);
            }
            this.isStarted = false;
        },

        /**
         * Returns a function that gets called in search bundle with
         * the search result as an argument which in turn returns
         * a function that gets called when the user clicks on the link
         * in the search result popup.
         *
         * @method _getSearchResultAction
         * @private
         * @return {Function}
         */
        _getSearchResultAction: function () {
            return (result) => {
                return () => {
                    const { lon, lat, name } = result;
                    const feature = createPointFeature({ lon, lat });
                    this.instance.getStateHandler().addTempLayer({ feature, name });
                };
            };
        },
        _toggleEmptySelection: function () {
            const disabled = this.instance.getSelectionsForLayer().length === 0;
            this.featuresPanel.getContainer().find('input[type=button]').prop({ disabled});
        }
    }
);
