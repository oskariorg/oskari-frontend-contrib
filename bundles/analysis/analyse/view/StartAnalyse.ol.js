import olFormatGeoJSON from 'ol/format/GeoJSON';
import { COLORS, FILL_COLORS, LIMITS, FILTER, PROPERTIES, BUFFER, METHODS, AGGREGATE_OPTIONS, SPATIAL_OPTIONS, SPATIAL_JOIN_MODES } from './constants';
import { showStyleEditor } from './StyleForm';
import { isAnalysisLayer, isTempLayer, getRandomizedStyle } from '../service/AnalyseHelper';

/**
 * @class Oskari.analysis.bundle.analyse.view.StartAnalyse
 * Request the analyse params and layers and triggers analyse actions
 * Analyses data  and save results
 *
 */
const VECTOR_LAYER_ID = '';

Oskari.clazz.define('Oskari.analysis.bundle.analyse.view.StartAnalyse',

    /**
     * @static @method create called automatically on construction
     *
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance} instance
     * reference to component that created this panel view
     * @param {Function} loc
     *
     */
    function (instance, loc) {
        var me = this;

        me.isEnabled = false;
        me.instance = instance;
        me.loc = loc;

        /* templates */
        me.template = {};
        for (let p in me.__templates) {
            if (me.__templates.hasOwnProperty(p)) {
                me.template[p] = jQuery(me.__templates[p]);
            }
        }

        me._ownStyle = null;
        me._popupControls = null;

        me.mainPanel = null;

        me.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');

        me.previewContent = null;
        me.previewImgDiv = null;

        me._param_footer = me.template.footer.clone();
        me._param_footer.append(this.loc('AnalyseView.aggregate.footer'));
        me._showFeatureDataAfterAnalysis = null;
        me._showFeatureDataWithoutSaving = null;
        this.controller = this.instance.getStateHandler().getController();
    }, {
        __templates: {
            content: '<div class="layer_data"></div>',
            tool:
                '<div class="tool ">' +
                '  <input type="checkbox"/>' +
                '  <label></label>' +
                '</div>',
            buttons: '<div class="buttons"></div>',
            help: '<div class="help icon-info"></div>',
            main:
                '<div class="basic_analyse">' +
                '  <div class="header">' +
                '    <div class="icon-close"></div>' +
                '    <h3></h3>' +
                '  </div>' +
                '  <div class="content"></div>' +
                '</div>',
            columnsContainer: '<div class="analyse-columns-container"></div>',
            columnsDropdown:
                '<select class="analyse-columns-dropdown"></select>',
            paramsOptionExtra: '<div class="extra_params"></div>',
            option:
                '<div class="analyse_option_cont analyse_settings_cont">' +
                '  <label>' +
                '    <input type="radio" name="selectedlayer" />' +
                '    <span></span>' +
                '  </label>' +
                '</div>',
            checkboxToolOption:
                '<div class="tool ">' +
                '  <label>' +
                '    <input type="checkbox" />' +
                '    <span></span>' +
                '  </label>' +
                '</div>',
            checkboxLabel:
                '<div class="columns_title_label">' +
                '  <label>' +
                '    <input type="checkbox" />' +
                '    <span></span>' +
                '  </label>' +
                '</div>',
            radioToolOption:
                '<div class="tool ">' +
                '  <label>' +
                '    <input type="radio" />' +
                '    <span></span>' +
                '  </label>' +
                '</div>',
            title:
                '<div class="analyse_title_cont analyse_settings_cont">' +
                '  <input class="settings_buffer_field" type="text" />' +
                '  <select id="oskari_analysis_analyse_view_start_analyse_settings_buffer_units" class="settings_buffer_units"></select>' +
                '</div>',
            title_name:
                '<div class="analyse_title_name analyse_settings_cont">' +
                '  <input class="settings_name_field" type="text" />' +
                '</div>',
            title_columns:
                '<div class="analyse_title_columns analyse_output_cont">' +
                '  <div class="columns_title_label"></div>' +
                '</div>',
            title_extra:
                '<div class="analyse_title_extra analyse_output_cont">' +
                '  <div class="extra_title_label"></div>' +
                '</div>',
            icon_colors: '<div class="icon-menu"></div>',
            featurePropertySelectButton:
                '<div class="analyse-select-featurelist">' +
                '  <a href="#">...</a>' +
                '</div>',
            featurePropertyList:
                '<div class="analyse-featurelist">' +
                '  <ul></ul>' +
                '</div>',
            featurePropertyListItem:
                '<li>' +
                '  <label>' +
                '    <input type="checkbox" />' +
                '    <span></span>' +
                '  </label>' +
                '</li>',
            featurePropertyRadioButton:
                '<li>' +
                '  <label>' +
                '    <input type="radio" />' +
                '    <span></span>' +
                '  </label>' +
                '</li>',
            areasAndSectorsExtra:
                '<div class="analyse_areas_and_sectors_cont analyse_settings_cont">' +
                '  <label class="area_size">' +
                '    <div></div>' +
                '    <input  type="text" pattern="[0-9]+" />' +
                '  </label>' +
                '  <select class="settings_area_size_units"></select>' +
                '  <label class="area_count">' +
                '    <div></div>' +
                '    <input type="text" pattern="[0-9]+" />' +
                '  </label>' +
                '  <label class="sector_count">' +
                '    <div></div>' +
                '    <input type="text" pattern="^0*[1-9]$|^0*1[0-2]$" />' +
                '  </label>' +
                '</div>',
            difference: '<div class="analyse_difference_cont"></div>',
            footer: '<div class="analyse_param_footer"></div>',
            wrapper: '<div class="analyse-result-popup-content"></div>',
            analysisAdditionalInfo: '<div class="analysis_additional_info"></div>'
        },

        /**
         * @method render
         * Renders view to given DOM element
         *
         * @param {jQuery} container
         * reference to DOM element this component will be rendered to
         *
         */
        render: function (container) {
            var me = this,
                content = me.template.main.clone();

            me.mainPanel = content;
            content.find('div.header h3').append(me.loc('AnalyseView.title'));

            // prepend makes the sidebar go on the left side of the map
            // we could use getNavigationDimensions() and check placement from it to append OR prepend,
            // but it does work with the navigation even on the right hand side being hidden,
            //  a new panel appearing on the left hand side and the map moves accordingly
            container.prepend(content);
            var contentDiv = content.find('div.content');

            me.alert.insertTo(contentDiv);

            var accordion = Oskari.clazz.create(
                'Oskari.userinterface.component.Accordion'
            );
            me.accordion = accordion;

            var contentPanel = Oskari.clazz.create(
                'Oskari.analysis.bundle.analyse.view.ContentPanel',
                me
            );
            me.contentPanel = contentPanel;
            const methodPanel = me._createMethodPanel();
            methodPanel.open();
            const outputPanel = me._createOutputPanel();
            const settingsPanel = me._createSettingsPanel();
            settingsPanel.open();

            contentPanel.addPanelsTo(accordion);
            accordion.addPanel(methodPanel);
            accordion.addPanel(settingsPanel);
            accordion.addPanel(outputPanel);
            accordion.getContainer().find('.header-icon-info').on('click',
                function (evt) {
                    evt.preventDefault();
                    return false;
                }
            );
            accordion.insertTo(contentDiv);

            // buttons
            // close
            container.find('div.header div.icon-close').on(
                'click',
                function () {
                    me.instance.disableAnalyseMode();
                }
            );
            contentDiv.append(me.template.analysisAdditionalInfo.clone());
            contentDiv.append(me._getButtons());

            var inputs = me.mainPanel.find('input[type=text]');
            inputs.on('focus', function () {
                me.instance.sandbox.postRequestByName(
                    'DisableMapKeyboardMovementRequest'
                );
            });
            inputs.on('blur', function () {
                me.instance.sandbox.postRequestByName(
                    'EnableMapKeyboardMovementRequest'
                );
            });
            // bind help tags
            var helper = Oskari.clazz.create(
                'Oskari.userinterface.component.UIHelper',
                me.instance.sandbox
            );
            helper.processHelpLinks(
                me.loc('AnalyseView.help'),
                content,
                me.loc('AnalyseView.error.title'),
                me.loc('AnalyseView.error.nohelp')
            );
        },

        _layerHasProperties: function (layer) {
            return layer && typeof layer.getPropertyTypes === 'function' && Object.keys(layer.getPropertyTypes()).length;
        },

        _createLabel: function (label, toolContainer, className) {
            toolContainer.find('label')
                .attr('class', className || label)
                .find('span').text(label);
        },

        /**
         * @private @method _createMethodPanel
         * Creates the method selection panel for analyse
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createMethodPanel: function () {
            const panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc('AnalyseView.method.label'));
            const container = panel.getContainer();
            // content
            const onChange = method => this._modifyExtraParameters(method);
            METHODS.forEach((value, i) => {
                const toolContainer = this.template.radioToolOption.clone();
                const { label, tooltip } = this.loc(`AnalyseView.method.options.${value}`);
                this._createLabel(label, toolContainer, 'method_radiolabel');

                const tooltipCont = this.template.help.clone();
                tooltipCont.attr('title', tooltip);
                container.append(tooltipCont);

                const input = toolContainer.find('input');
                input.attr({value, name: 'analysis_method'});
                input.prop('checked', i === 0);
                input.on('change', () => onChange(value));
                container.append(toolContainer);
            });

            return panel;
        },

        /**
         * @private @method _createSettingsPanel
         * Creates a settings panel for analyses
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createSettingsPanel: function () {
            const me = this;
            const panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            const container = panel.getContainer();

            panel.setTitle(this.loc('AnalyseView.settings.label'));

            // Changing part of parameters ( depends on method)
            var extra = this.template.paramsOptionExtra.clone();
            container.append(extra);

            me._addExtraParameters(container, METHODS[0]);

            var columnsContainer = this.template.columnsContainer.clone();
            container.append(columnsContainer);
            this._refreshColumnsSelector(columnsContainer, me.loc('AnalyseView.params.label'));

            me._addTitle(container, 'analyse_name.label', 'analyse_name.labelTooltip');
            container.append(me.template.title_name.clone());

            var showFeatureData = me.template.checkboxLabel.clone();
            showFeatureData.find('input').attr({'name': 'showFeatureData', 'id': 'showFeatureDataAfterAnalysis'});
            showFeatureData.find('label span').append(me.loc('AnalyseView.showFeatureData'));
            container.append(showFeatureData);

            return panel;
        },

        /**
         * @method _refreshColumnsSelector
         * Creates the selector to select which attributes should be preserved in the analysis
         * (all, none or select from list).
         *
         * @param {jQuery Object} columnsContainer the dom element the columns selector should be appended to.
         *
         */
        _refreshColumnsSelector: function (title) {
            const columnsContainer = this.mainPanel.find('div.analyse-columns-container');
            const columnsTitle = this.template.title_columns.clone();
            const tooltipCont = this.template.help.clone();

            columnsTitle.find('.columns_title_label').text(title);
            tooltipCont.attr('title', this.loc('AnalyseView.params.labelTooltip'));
            tooltipCont.addClass('columns-icon-info');
            columnsTitle.find('.columns_title_label').after(tooltipCont);
            columnsContainer.append(columnsTitle);

            Object.values(PROPERTIES).forEach((value, i) => {
                const toolContainer = this.template.radioToolOption.clone();
                const label = this.loc(`AnalyseView.params.options.${value}`);
                this._createLabel(label, toolContainer, 'params_radiolabel');

                const input = toolContainer.find('input');
                input.attr({ value, name: 'analysis_properties'});
                input.prop('checked', i === 0);
                if (value === 'select') {
                    this._appendFeaturePropertyList(toolContainer);
                }
                columnsContainer.append(toolContainer);
            });

            // Check that params selection is allowed for the selected layer
            this._checkParamsSelection();
        },

        /**
         * @method _appendFeatureList
         * Creates a list to select fields to include in analyse
         *
         * @param {jQuery object} toolContainer
         *
         */
        _appendFeaturePropertyList: function (toolContainer) {
            const selectButton = this.template.featurePropertySelectButton.clone();
            const listContainer = this.template.featurePropertyList.clone();

            selectButton.append(listContainer);
            toolContainer.append(selectButton);
            listContainer.hide();
            const listElem = listContainer.find('ul')
            listElem.empty();
            this._appendItemsToFeaturePropertyList(listElem);

            selectButton.find('a').on('click', function (e) {
                e.preventDefault();
                listContainer.toggle();
            });
        },

        /**
         * @method _appendFields
         * Appeds the fields from the layer to the feature list
         *
         * @param {jQuery object} listElem
         */
        _appendItemsToFeaturePropertyList: function (listElem) {
            const layer = this._getSelectedMapLayer();
            if (!layer) {
                return;
            }
            // get names from types because labels may be empty
            const types = layer.getPropertyTypes();
            const labels = layer.getPropertyLabels();
            Object.keys(types).forEach( name => {
                const listItem = this.template.featurePropertyListItem.clone();
                listItem
                    .find('input')
                    .prop('name', 'analyse-feature-property')
                    .val(name);
                listItem
                    .find('span')
                    .text(labels[name] || name);
                listItem.on('change', ()  => this._checkPropertyList(listElem));
                listElem.append(listItem);
            });
            this._preselectProperties(listElem);
        },
        /**
         * @private @method _preselectProperties
         * Preselects the max number of feature properties permitted
         * (defaults to 10).
         *
         * @param  {jQuery} propertyList
         *
         */
        _preselectProperties: function (propertyList) {
            if (this._getSelectedMethod() === 'aggregate') {
                this._preselectPropertiesAggregate(propertyList);
                return;
            }
            const { properties } = LIMITS;
            propertyList.find('input').each((index, input) => {
                if (index < properties) {
                    jQuery(input).prop('checked', true);
                } else {
                    jQuery(input).prop({ checked: false, disabled: true });
                }
            });
        },

        /**
         * @private method _preselectPropertiesAggregate
         * Properties preselection for aggregate method.
         * -By default only select numeric fields.
         * -Add infotext, if text type fields are selected
         */
        _preselectPropertiesAggregate: function (propertyList) {
            const { properties } = LIMITS;
            let count = 0;
            const onChange = () => {
                const checked = propertyList.find('li input:checked');
                const fieldSelectionInfo = this.mainPanel.find('div.analysis_additional_info');
                const allNumeric = checked.toArray().every(elem => this._isNumericField(elem.value));
                const infoText = allNumeric ? '' : this.loc('AnalyseView.aggregate.aggregateAdditionalInfo');
                fieldSelectionInfo.text(infoText);
            };

            propertyList.find('li input').each((index, elem) => {
                const input = jQuery(elem);
                const isNumeric = this._isNumericField(input.val());
                if (count < properties && isNumeric) {
                    input.prop('checked', true);
                    count++;
                } else if (count >= properties) {
                    input.prop('disabled', true);
                }
                input.on('change', () => onChange());
            });
        },
        /**
         * @private @method _checkPropertyList
         * Checks if the number of checked properties is over
         * the permitted limit and if so, disables the other
         * properties.
         *
         * @param  {jQuery} propertyList
         *
         */
        _checkPropertyList: function (propertyList) {
            var checked = propertyList.find('li input:checked'),
                unchecked = propertyList.find('li input:not(:checked)');

            if (checked.length >= LIMITS.properties) {
                unchecked.prop('disabled', true);
            } else {
                unchecked.prop('disabled', false);
            }
        },

        /**
         * @method _refreshFields
         * Refreshes the fields list after a layer has been added or changed.
         *
         *
         */
        _refreshFields: function () {
            const listElem = this.mainPanel.find('div.analyse-featurelist ul');
            listElem.empty();
            this._appendItemsToFeaturePropertyList(listElem);
        },

        /**
         * @private @method _createOutputPanel
         * Creates a output panel for analyse visualization
         *
         *
         * @return {jQuery} Returns the created panel
         */
        _createOutputPanel: function () {
            const panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
            panel.setTitle(this.loc('AnalyseView.output.label'));

            // tooltip
            const tooltipCont = this.template.help.clone();
            tooltipCont.attr('title', this.loc('AnalyseView.output.tooltip'));
            tooltipCont.addClass('header-icon-info');
            panel.getHeader().append(tooltipCont);

            const button = Oskari.clazz.create('Oskari.userinterface.component.Button');
            button.setTitle(this.loc('AnalyseView.output.editStyle'));
            button.setPrimary(true);
            button.setHandler(() => {
                this.openStyleEditor();
            });
            panel.setContent(button.getElement());

            return panel;
        },

        _getLayerById: function (layerId) {
            const layer = this.instance.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
            if (layer) {
                return layer;
            }
            return this.controller.getState().tempLayers.find(l => l.getId() === layerId);
        },

        /**
         * @private @method _getLayers
         *
         * @return {Object} Returns selected layers
         */
        _getLayers: function () {
            return this.controller.getLayers();
        },
        /**
         * @private @method _getOLGeometry
         * parse JSON geometry to OL geometry
         *
         *@param {JSON} geojson
         * @return {OL geometry} Returns OL geometry - only the 1st one
         */
        _getOLGeometry: function (geojson) {
            if (geojson) {
                return new olFormatGeoJSON().readFeatures(geojson)[0];
            }
            return null;
        },

        /**
         * @method getStyleValues
         * Returns style values as an object
         *
         *
         * @return {Object}
         */
        getStyleValues: function (pick) {
            if (!this._ownStyle) {
                this._ownStyle = getRandomizedStyle();
            }
            const style = this._ownStyle;
            if (pick) {
                this._ownStyle = null;
            }
            return style;
        },
        openStyleEditor : function () {
            if (this._popupControls) {
                return;
            }
            const style = this.getStyleValues();
            const onSave = style => {
                this._ownStyle = style;
                this.closeStyleEditor();
            };
            const onClose = () => this.closeStyleEditor();
            this._popupControls = showStyleEditor(style, getRandomizedStyle, onSave, onClose)
        },
        closeStyleEditor: function () {
            if (this._popupControls) {
                this._popupControls.close();
            }
            this._popupControls = null;
        },

        /**
         * @private @method _getButtons
         * Renders data buttons to DOM snippet and returns it.
         *
         *
         * @return {jQuery} container with buttons
         */
        _getButtons: function () {
            var me = this,
                buttonCont = this.template.buttons.clone(),
                analyseBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                closeBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.buttons.ExitButton'
                );

            closeBtn.setHandler(function () {
                me.instance.disableAnalyseMode();
            });
            closeBtn.setId(
                'oskari_analysis_analyse_view_start_analyse_buttons_cancel'
            );
            closeBtn.insertTo(buttonCont);

            analyseBtn.setTitle(this.loc('AnalyseView.buttons.analyse'));
            analyseBtn.addClass('primary');
            analyseBtn.setHandler(function () {
                // Check parameters and continue to analyse action
                me._analyseMap();
            });
            analyseBtn.setId(
                'oskari_analysis_analyse_view_start_analyse_buttons_analyse'
            );
            analyseBtn.insertTo(buttonCont);

            return buttonCont;
        },

        /**
         * @private @method _addExtraParameters
         * Add parameters data UI according to method
         *
         * @param {String} prefixedMethod analyse method
         *
         */
        _addExtraParameters: function (container, method) {
            if (!this.extraParamBuilders[method]) {
                return;
            }
            this.extraParamBuilders[method].call(this, container);
        },

        /**
         * @method _addTitle
         * @private
         * Add a title to the given container
         * @param {jQuery} contentPanel div to append extra params
         * @param {String} label        Label string
         */
        _addTitle: function (contentPanel, labelKey, tooltipKey) {
            const title = this.template.title_extra.clone();
            const loc = key => this.loc(`AnalyseView.${key}`);
            title.find('.extra_title_label').html(loc(labelKey));
            if (tooltipKey) {
                const tooltipCont = this.template.help.clone();
                tooltipCont.attr('title', loc(tooltipKey));
                tooltipCont.addClass('params-icon-info');
                title.find('.extra_title_label').after(tooltipCont);
            }
            contentPanel.append(title);
        },
        _setShowFeatureData: function (checked, disabled = false) {
            this.mainPanel.find('input[name=showFeatureData]').prop({ checked, disabled });
        },

        /**
         * These add extra parameters to the UI
         */
        extraParamBuilders: {
            /**
             * @private @method buffer
             * Add extra parameters for params UI according to method buffer
             *
             * @param {jQuery} contentPanel  div to append extra params
             *
             */
            buffer: function (contentPanel) {
                const bufferOptions = this.template.title.clone();
                const bufferUnitSelect = bufferOptions.find('select.settings_buffer_units');

                this._addTitle(contentPanel, 'buffer_size.label', 'buffer_size.labelTooltip');
                bufferOptions.find('.settings_buffer_field').attr({
                    'value': '',
                    'placeholder': this.loc('AnalyseView.buffer_size.tooltip')
                });
                Object.entries(BUFFER).forEach(([key, value]) => {
                    const label = this.loc(`AnalyseView.buffer_units.${key}`);
                    bufferUnitSelect.append(`<option value="${value}">${label}</option>`);
                });
                contentPanel.append(bufferOptions);
            },

            /**
             * @method aggregate
             * @private
             ** Add extra parameters for params UI according to method aggregate
             * @param {jQuery} contentPanel  div to append extra params
             */
            aggregate: function (contentPanel) {
                // Title
                this._addTitle(contentPanel, 'aggregate.label', 'aggregate.labelTooltip');

                AGGREGATE_OPTIONS.forEach((value) => {
                    const toolContainer = this.template.checkboxToolOption.clone();
                    const label = this.loc(`AnalyseView.aggregate.options.${value}`);
                    this._createLabel(label, toolContainer, 'params_radiolabel');

                    toolContainer.find('input')
                        .prop('checked', true)
                        .attr({ value, name: 'analysis_aggregate' });

                    contentPanel.append(toolContainer);
                    toolContainer.find('input');

                    // Disable no data, if no no data
                    if (value === 'NoDataCnt') {
                        if (this._getNoDataValue()) {
                            toolContainer.append(this._param_footer);
                        } else {
                            toolContainer.find('input').prop({ checked: false, disabled: true });
                        }
                    }
                });

                var showValuesCheckbox = this.template.checkboxLabel.clone();
                showValuesCheckbox.addClass('show_data_in_popup');
                showValuesCheckbox.find('input').attr('id', 'showFeatureDataWithoutSaving');
                showValuesCheckbox.find('label span').append(this.loc('AnalyseView.showValuesCheckbox'));
                contentPanel.parent().append(showValuesCheckbox);

                showValuesCheckbox.find('input').on('change', (event) => {
                    const checked = event.target.checked;
                    this._setShowFeatureData(!checked, checked);
                });
                this._setShowFeatureData(true);
            },

            clip: function (contentPanel) {
                // use intersect
                return this.extraParamBuilders.intersect.call(this, contentPanel, false);
            },

            /**
             * @private @method _intersectExtra
             * Add extra parameters for params UI according to method needs
             *
             * @param {jQuery} contentPanel  div to append extra params
             * @param {boolean} full define if full or limited set of choices is shown
             *
             */
            intersect: function (contentPanel, showSpatial = true) { // showSpatial is actually clip method
                // Set radiobuttons for selecting intersecting layer
                const targetLayer = this._getSelectedMapLayer();
                const name = targetLayer?.getName() || '';
                const targetId = targetLayer?.getId();
                const targetLayerElem = jQuery(`<span>${name}</span>`);

                if (showSpatial) {
                    this._addTitle(contentPanel, 'spatial.target', 'spatial.targetTooltip');
                    this._addTitle(contentPanel, 'spatial.intersectingLayer', 'spatial.intersectingLayerTooltip');
                    this._setShowFeatureData(true);
                } else {
                    this._addTitle(contentPanel, 'intersect.target', 'intersect.targetLabelTooltip');
                    this._addTitle(contentPanel, 'intersect.label', 'intersect.labelTooltip');
                }
                contentPanel.append(targetLayerElem);

                this._getLayers().forEach((layer, i) => {
                    const id = layer.getId();
                    if (id === targetId) {
                        return;
                    }
                    const toolContainer = this.template.radioToolOption.clone();
                    this._createLabel(layer.getName(), toolContainer, 'params_radiolabel');
                    const input = toolContainer.find('input');
                    input.attr('value', id);
                    input.prop('checked', i === 0);
                    contentPanel.append(toolContainer);
                });

                // Show spatial operator choice
                if (showSpatial) {
                    // title spatial operator
                    this._addTitle(contentPanel, 'spatial.label', 'spatial.labelTooltipIntersect');

                    // spatial operators
                    SPATIAL_OPTIONS.forEach(function (option, i) {
                        const toolContainer = this.template.radioToolOption.clone();
                        const label = this.loc(`AnalyseView.spatial.options.${option}`);
                        this._createLabel(label, toolContainer, 'params_radiolabel');
                        const input = toolContainer.find('input');
                        input.attr('value', id);
                        input.prop('checked', i === 0);
                        contentPanel.append(toolContainer);
                    });
                }
            },

            /**
             * @method layer_union
             * Add layer selection ui for analyse layer union.
             *
             * @param  {jQuery} contentPanel
             *
             * @return {undefined}
             */
            layer_union: function (contentPanel) {
                const selectedLayer = this._getSelectedMapLayer();

                if (!isAnalysisLayer(selectedLayer)) {
                    contentPanel.append(jQuery(
                        '<div>' + this.loc('AnalyseView.layer_union.notAnalyseLayer') + '</div>'
                    ));
                    return;
                }
                const selectedId = selectedLayer.getId();
                const selectedProps = Object.keys(selectedLayer.getPropertyTypes());

                const isValidLayer = (layer) => {
                    if (!isAnalysisLayer(layer) || layer.getId() === selectedId){
                        return false;
                    }
                    const props = Object.keys(layer.getPropertyTypes());
                    if (props.length !== selectedProps.length) {
                        return false;
                    }
                    return props.every(p => selectedProps.includes(p))
                }
                const layers = this._getLayers().filter(l => isValidLayer(l));

                if (layers.length === 0) {
                    contentPanel.append(jQuery(
                        '<div>' + this.loc('AnalyseView.layer_union.noLayersAvailable') + '</div>'
                    ));
                    return;
                }

                this._addTitle(contentPanel, 'layer_union.label', 'layer_union.labelTooltip');

                // layers
                layers.forEach((layer, i) => {
                    const toolContainer = this.template.checkboxToolOption.clone();
                    this._createLabel(layer.getName(), toolContainer, 'params_checklabel');
                    const input = toolContainer.find('input');
                    input.attr('value', layer.getId());
                    input.prop('checked', i === 0);
                    contentPanel.append(toolContainer);
                });
            },

            /**
             * @method areas_and_sectors
             * Add params ui for areas and sectors.
             *
             * @param  {jQuery} contentPanel
             *
             * @return {undefined}
             */
            areas_and_sectors: function (contentPanel) {
                const extraParams = this.template.areasAndSectorsExtra.clone();
                const unitsSelect = extraParams.find('.settings_area_size_units');
                const keys = ['area_size', 'area_count', 'sector_count'];

                this._addTitle(contentPanel, 'areas_and_sectors.label', 'areas_and_sectors.labelTooltip');
                Object.entries(BUFFER).forEach(([key, value]) => {
                    const label = this.loc(`AnalyseView.buffer_units.${key}`);
                    unitsSelect.append(`<option value="${value}">${label}</option>`);
                });
                keys.forEach(key => {
                    const label = this.loc(`AnalyseView.areas_and_sectors.${key}`);
                    const tooltip = this.loc(`AnalyseView.areas_and_sectors.${key}_tooltip`);
                    extraParams.find(`${key} div`).text(label);
                    extraParams.find(`${key} input`).attr('placeholder', tooltip);
                });
                contentPanel.append(extraParams);
                this._setShowFeatureData(true);
            },

            /**
             * @method _diffExtra
             * Add params ui for difference.
             *
             * @param  {jQuery} contentPanel
             *
             * @return {undefined}
             */
            difference: function (contentPanel) {
                const extraParams = this.template.difference.clone();
                const targetLayer = this._getSelectedMapLayer();
                const targetId = targetLayer?.getId();

                // First layer is selected outside this panel, so no selection to be done here
                this._addTitle(extraParams, 'difference.firstLayer', 'difference.firstLayerTooltip');
                extraParams.append(jQuery('<span></span>').text(targetLayer?.getName() || ''));

                // Field for first layer, it's well possible that the layer doesn't have any...
                this._addTitle(extraParams, 'difference.field', 'difference.firstLayerFieldTooltip');
                if (this._layerHasProperties(targetLayer)) {
                    const featureList = this.template.featurePropertyList.clone();
                    featureList.attr('id', 'analyse-layer1-field');
                    this._addFeaturePropertyList(
                        targetLayer,
                        featureList.find('ul')
                    );
                    extraParams.append(featureList);
                }

                // Second layer selection
                this._addTitle(extraParams, 'difference.secondLayer', 'difference.secondLayerTooltip');

                const layers = this.getLayers();
                const differenceLayer = layers.find(l => l.getId() !== targetId);
                const differenceId = differenceLayer?.getId();
                const onChange = (layerId) => {
                    this._addFeatureList(
                        this._getLayerById(layerId),
                        jQuery('#analyse-layer2-field').find('ul'),
                        'analyse-layer2-field-property'
                    );
                    const differenceLayer = this._getLayerById(layerId);
                    const joinList = this._createJoinList(targetLayer, differenceLayer);
                    // Update the key list
                    jQuery('div.analyse-featurelist#analyse-key-field').replaceWith(joinList);
                };
                layers.forEach(layer => {
                    const layerId = layer.getId();
                    if (layerId === targetId) {
                        return;
                    }
                    const toolContainer = this.template.radioToolOption.clone();
                    this._createLabel(layer.getName(), toolContainer, 'params_radiolabel');
                    toolContainer.find('label span').text();
                    const input = toolContainer.find('input');
                    input.attr('value', layerId);
                    input.prop('checked', differenceId === layerId)
                    input.on('change', onChange(layerId));
                    extraParams.append(toolContainer);
                });

                // Second layer field selection
                this._addTitle(extraParams, 'difference.field', 'difference.secondLayerFieldTooltip');
                const featureList = this.template.featurePropertyList.clone();
                featureList.attr('id', 'analyse-layer2-field');
                if (this._layerHasProperties(differenceLayer)) {
                    this._addFeaturePropertyList(
                        differenceLayer,
                        featureList.find('ul')
                    );
                }
                extraParams.append(featureList);

                this._addTitle(extraParams, 'difference.keyField', 'difference.keyFieldTooltip');
                extraParams.append(this._createJoinList(targetLayer, differenceLayer));

                contentPanel.append(extraParams);

                this._setShowFeatureData(true);
            },

            /**
             * @method spatial_join
             * Add layer selection ui for analyse spatial join.
             *
             * @param  {jQuery} contentPanel
             *
             * @return {undefined}
             */
            spatial_join: function (contentPanel) {
                // - Second layer selection
                // - Option selection for both layers
                //   - combined max 10 options
                const extraParams = this.template.difference.clone();
                const targetLayer = this._getSelectedMapLayer();
                const targetId = targetLayer?.getId();
                const showSpatial = true; // Show also spatial operator choice

                const limitSelection = (autoSelect) => {
                    const features = extraParams.find('.analyse-featurelist ul li input');
                    const selectedFeatures = features.filter(':checked').length;
                    if (autoSelect && selectedFeatures < 10) {
                        // Some selections can still be made...
                        const newSelections = features
                            .filter(':not(:checked)')
                            .slice(0, 10 - selectedFeatures);

                        selectedFeatures += newSelections.length;
                        newSelections.prop('checked', true);
                    }

                    if (selectedFeatures >= 10) {
                        // max amount of features selected, disable the rest
                        features.filter(':not(:checked)').prop('disabled', true);
                    } else {
                        // Features can still be selected
                        features.prop('disabled', false);
                    }
                };

                // spatial join mode: normal/aggregate
                this._addTitle(extraParams, 'spatial_join.mode', 'spatial_join.modeTooltip');
                SPATIAL_JOIN_MODES.forEach((mode, i) => {
                    const modeToolContainer = this.template.radioToolOption.clone();
                    const label = this.loc(`AnalyseView.spatial_join.${mode}Mode`);
                    this._createLabel(label, modeToolContainer, 'params_radiolabel');
                    const input = modeToolContainer.find('input');
                    inout.attr('value', mode)
                    input.prop('checked', i===0);
                    input.on('change', () => {
                        // TODO: addpropertylist
                        // limitSelection(false);
                        const inputs = extraParams.find('input[name=analyse-layer1-field-property]');
                        inputs.forEach(input => input.setAttribute('type', 'checkbox'));
                    });
                    extraParams.append(modeToolContainer);
                });

                // First layer is selected outside this panel, so no selection to be done here
                this._addTitle(extraParams, 'spatial_join.firstLayer', 'spatial_join.firstLayerTooltip');
                const targetName = targetLayer?.getName() || '';
                extraParams.append(`<span>${targetName}</span>`);

                // Field for first layer, it's well possible that the layer doesn't have any...
                this._addTitle(extraParams, 'params.label', 'spatial_join.firstLayerFieldTooltip');
                if (this._layerHasProperties(targetLayer)) {
                    const featureList = this.template.featurePropertyList.clone();
                    featureList.attr('id', 'analyse-layer1-field');
                    this._addFeaturePropertyList(
                        targetLayer,
                        featureList.find('ul')
                    );
                    featureList.find('ul li').on('change', function () {
                        limitSelection(false);
                    });
                    extraParams.append(featureList);
                }

                // Second layer selection
                this._addTitle(extraParams, 'spatial_join.secondLayer', 'spatial_join.secondLayerTooltip');
                const layers = this.getLayers();
                const differenceLayer = layers.find(l => l.getId() !== targetId);

                layers.forEach((layer, i) => {
                    const layerId = layer.getId();
                    if (layerId === targetId) {
                        return;
                    }
                    const toolContainer = this.template.radioToolOption.clone();
                    this._createLabel(layer.getName(), toolContainer, 'params_radiolabel');
                    const input = toolContainer.find('input');
                    input.attr('value', layerId);
                    input.prop('checked', i===0);
                    extraParams.append(toolContainer);
                });

                // Second layer field selection
                this._addTitle(extraParams, 'params.label', 'spatial_join.secondLayerFieldTooltip');
                const featureList = this.template.featurePropertyList.clone();
                featureList.attr('id', 'analyse-layer2-field');
                if (this._layerHasProperties(differenceLayer)) {
                    this._addFeaturePropertyList(
                        differenceLayer,
                        featureList.find('ul'),
                        true
                    );
                    featureList.find('ul li').on('change', function () {
                        limitSelection(false);
                    });
                }
                extraParams.append(featureList);
                limitSelection(true);

                contentPanel.append(extraParams);

                if (showSpatial) {
                    // title spatial operator
                    const title = this.template.title_extra.clone();
                    title.find('.extra_title_label').text(this.loc('AnalyseView.spatial.label'));
                    contentPanel.append(title);

                    // spatial operators
                    SPATIAL_OPTIONS.forEach((option, i) => {
                        const toolContainer = this.template.radioToolOption.clone();
                        const label = this.loc(`AnalyseView.spatial.options.${option}`);
                        this._createLabel(label, toolContainer, 'params_radiolabel');

                        const input = toolContainer.find('input');
                        input.prop('checked', i===0);
                        input.attr('value', option);
                        contentPanel.append(toolContainer);
                    });
                }

                this._setShowFeatureData(true);
            }
        },

        _createJoinList: function (targetLayer, differenceLayer) {
            // Check equal join keys
            const featureList = this.template.featurePropertyList.clone();
            let joinKey;
            if (differenceLayer && targetLayer) {
                const { commonId: diff } = differenceLayer.getWpsLayerParams();
                const { commonId: target } = targetLayer.getWpsLayerParams();
                if (diff === target) {
                    joinKey = diff;
                }
            }
            if (joinKey) {
                featureList.find('ul').append(joinKey);
            } else {
                this._addFeaturePropertyList(
                    targetLayer,
                    featureList.find('ul')
                );
            }
            return featureList;
        },

        _addFeaturePropertyList: function (layer, container, multiSelect) {
            // Make sure the container is empty
            container.empty();
            const elementTemplate = multiSelect ? this.template.featurePropertyList : this.template.featurePropertyRadioButton;
            const properties = layer.getPropertyTypes();
            const labels = layer.getPropertyLabels();
            Object.keys(properties).forEach((name, i) => {
                const elem = elementTemplate.clone();
                const input = elem.find('input');
                input.prop('checked', multiSelect ? true : i === 0);
                input.val(name);
                const label = labels[name] || name;
                this._createLabel(label, elem);
                container.append(elem);
            });
        },

        /**
         * @private @method _refreshIntersectLayers
         * Refreshes layer list in the intersect or clip parameters
         *
         *
         */
        _refreshIntersectLayers: function () {
            var dataLayers = jQuery('div.basic_analyse div.analyse_option_cont.analyse_settings_cont input[type=radio]'),
                paramLayer,
                i,
                j;

            // No need to refresh?
            if ((jQuery('div.basic_analyse div.extra_params input[type=radio][name=intersect]')).length === 0) {
                return;
            }

            for (i = 0; i < dataLayers.length; i += 1) {
                paramLayer = jQuery('div.basic_analyse div.extra_params input[type=radio][name=intersect][value=' + jQuery(dataLayers[i]).attr('id') + ']');
                for (j = 0; j < dataLayers.length; j += 1) {
                    if (jQuery(dataLayers[i]).prop('checked')) {
                        paramLayer.prop('checked', false);
                        paramLayer.parent().hide();
                    } else {
                        paramLayer.parent().show();
                    }
                }
            }
        },

        /**
         * @private @method _modifyExtraParameters
         * modify parameters data UI according to method
         *
         * @param {String} method  analyse method
         *
         */
        _modifyExtraParameters: function (method) {
            const contentPanel = this.mainPanel.find('div.extra_params');

            // Remove old content
            contentPanel.empty();
            this.mainPanel.find('.show_data_in_popup').remove();
            this.mainPanel.find('div.analyse-columns-container').empty();
            this._setShowFeatureData(false);
            // Empty the attribute selector for preserved layer attributes
            // And create it unless the selected method is aggregate,
            // in which case create a dropdown to select an attribute to aggregate
            if ('aggregate' === method) {
                this._refreshColumnsSelector(this.loc('AnalyseView.params.aggreLabel'));
            } else if ('difference' === method || 'spatial_join' === method) {
                // difference and spatial join doesn't need anything here...
            } else {
                this._refreshColumnsSelector(this.loc('AnalyseView.params.label'));
            }
            this._addExtraParameters(contentPanel.parent(), method);
        },

        /**
         * @private @method refreshAnalyseData
         * refresh analyse data layers in selection box
         *
         *
         */
        refreshAnalyseData: function (state) {
            this._refreshFields();
            this._modifyAnalyseName();
            this.showInfos();
            this._checkParamsSelection();
            this._checkMethodSelection();
            this._refreshIntersectLayers();
            this.refreshExtraParameters();
        },

        /**
         * @private @method refreshExtraParameters
         * refresh analyse parameters UI in the selection box
         *
         *
         */
        refreshExtraParameters: function () {
            this._modifyExtraParameters(this._getSelectedMethod());
        },

        /**
         * @private @method _getSelectedMethod
         * Convenience method for getting the analysis method currently selected.
         */
        _getSelectedMethod: function () {
            return this.mainPanel.find('input[name=analysis_method]:checked').val();
        },
        /**
         * @private @method _gatherSelections
         * Gathers analyse selections and returns them as JSON object
         *
         *
         * @return {Object}
         */
        _gatherSelections: function () {
            const layer = this._getSelectedMapLayer();
            // No layers
            if (!layer) {
                return;
            }
            const container = this.mainPanel;
            this._showFeatureDataAfterAnalysis = container.find('input[name=showFeatureData]')[0].checked;
            this._showFeatureDataWithoutSaving = container.find('#showFeatureDataWithoutSaving')[0]?.checked || false;

            const method = this._getSelectedMethod();

            // Get the feature fields
            var fieldSelection = container.find('input[name=analysis_properties]:checked').val();
            const fieldTypes = this._layerHasProperties(layer) ? layer.getPropertyTypes() : {};
            let fields = [];
            // All fields
            if (fieldSelection === 'all') {
                fields = Object.keys(fieldTypes);
            } else if (fieldSelection === 'select') {
                // Selected fields
                var fieldsList = jQuery('div.analyse-featurelist').find('ul li input:checked');
                fields = jQuery.map(fieldsList, function (val) {
                    return val.value;
                });
            }
            const layerType = layer.getLayerType();
            // HACK!!
            // There should be one propertety in filter - in other case all properties are retreaved by WPS
            // Userlayer has forced selection for no properties => fields is empty array
            // Add feature_id field (can't use normal fields because them values are inside property_json)
            if (layerType === 'userlayer') {
                fields = ['feature_id'];
            }
            const selections = {
                layerId: isTempLayer(layer) ? -1 : layer.getId(),
                name: container.find('.settings_name_field').val() || '_',
                fields,
                fieldTypes,
                method,
                layerType,
                style: this.getStyleValues(true),
                bbox: this.instance.getSandbox().getMap().getBbox(),
                opacity: layer.getOpacity()
            };

            // Get method specific selections
            const methodSelections = this._getMethodSelections(method);

            if (isTempLayer(layer)) {
                selections.features = [layer.getFeatureAsGeoJSON()];
            }
            return { ...selections, ...methodSelections };
        },

        /**
         * @private @method _getMethodSelections
         * Adds method specific parameters to selections
         *
         * @param {Object} layer an Oskari layer
         * @param {Object} defaultSelections the defaults, such as name etc.
         *
         * @return {Object} selections for a given method
         */
        _getMethodSelections: function (method) {
            // FIXME: why selections are gathered for every method since only one is needed?
            var me = this;
            const container = this.mainPanel;
            const selectedLayer = this._getSelectedMapLayer();
            const buffer = container.find('.settings_buffer_field').val();
            const bufferUnit = container.find('.settings_buffer_units option:selected').val();
            const bufferUnitMultiplier = this.bufferUnits[bufferUnit] || 1;
            const bufferSize = buffer * bufferUnitMultiplier;
            // aggregate
            var aggregateFunctions = container.find('input[name=aggre]:checked');
            aggregateFunctions = jQuery.map(aggregateFunctions, elem => elem.value);
            var aggregateAttribute = container.find('select.analyse-columns-dropdown option').filter(':selected').val();
            // union
            var unionLayerId = container.find('input[name=union-layer]:checked').val();
            // clip, intersect
            let intersectLayerId = container.find('input[name=intersect-layer]:checked').val();
            const intersectLayer =  this._getLayerById(intersectLayerId);
            let intersectFeatures;
            if (isTempLayer(intersectLayer)) {
                intersectLayerId = -1;
                intersectFeatures = [tempLayer.getFeatureAsGeoJSON()];
            }

            var spatialOperator = null;
            if (container.find('input[name=spatial_join_mode]:checked').val() === 'aggregate') {
                spatialOperator = container.find('input[name=spatial_join_mode]:checked').val();
            } else {
                spatialOperator = container.find('input[name=spatial-operator]:checked').val();
            }

            // layer union
            var layerUnionLayers = this._getLayerUnionLayers(container);
            const areaCount = container.find('input.settings_area_count_field').val();
            const areaSize = container.find('input.settings_area_size_field').val();
            const areaUnit = container.find('.settings_area_size_units option:selected').val();
            const areaUnitMultiplier = this.bufferUnits[areaUnit] || 1;
                sectorCount = container.find('input.settings_sector_count_field').val();

            areaSize *= areaUnitMultiplier;
            if (areaCount > 12) {
                areaCount = LIMITS.areas;
            }

            const layerUnionLayers = jQuery.map(container.find('input[name=layer_union_layer]:checked'), elem => elem.value);
            layerUnionLayers.push(selectedLayer.getId());

            var differenceLayerId = container.find('input[name=differenceLayer]:checked').val(),
                differenceFieldA1 = container.find('input[name=analyse-layer1-field-property]:checked').val(),
                differenceFieldB1 = container.find('input[name=analyse-layer2-field-property]:checked').val(),
                featuresA1 = container.find('input[name=analyse-layer1-field-property]:checked').map(function () {
                    return this.value;
                }).get(),
                featuresB1 = container.find('input[name=analyse-layer2-field-property]:checked').map(function () {
                    return this.value;
                }).get(),
                keyField = container.find('input[name=analyse-key-field-property]:checked').val();
            // Predefined key
            if (typeof keyField === 'undefined') {
                keyField = container.find('div#analyse-key-field > ul').text();
            }
            const no_data = me._getNoDataValue();
            var methodSelections = {
                'buffer': {
                    methodParams: {
                        distance: bufferSize,
                        no_data
                    }
                },
                'aggregate': {
                    methodParams: {
                        functions: aggregateFunctions, // TODO: param name?
                        locales: aggregateFunctions.map(func => this._getAggregateLocalization(func)),
                        attribute: aggregateAttribute,
                        no_data
                    }
                },
                'union': {
                    methodParams: {
                        layerId: unionLayerId,
                        no_data
                    }
                },
                'clip': {
                    method: 'intersect', // use intersect method for clip
                    methodParams: {
                        layerId: intersectLayerId,
                        features: intersectFeatures,
                        operator: spatialOperator,
                        no_data
                    }
                },
                'intersect': {
                    methodParams: {
                        layerId: intersectLayerId,
                        operator: spatialOperator, // TODO: param name?
                        features: intersectFeatures,
                        no_data
                    }
                },
                'layer_union': {
                    methodParams: {
                        layers: layerUnionLayers
                    }
                },
                'areas_and_sectors': {
                    override_sld: 'sld_label_t1', // TODO: is this really needed?
                    methodParams: {
                        areaCount: areaCount,
                        areaDistance: areaSize,
                        sectorCount: sectorCount
                    }
                },
                'difference': {
                    override_sld: 'sld_muutos_n1', // TODO: is this really needed?
                    methodParams: {
                        layerId: differenceLayerId,
                        fieldA1: differenceFieldA1,
                        fieldB1: differenceFieldB1,
                        keyA1: keyField,
                        keyB1: keyField,
                        no_data
                    }
                },
                'spatial_join': {
                    methodParams: {
                        layerId: differenceLayerId,
                        featuresA1: featuresA1,
                        featuresB1: featuresB1,
                        operator: spatialOperator,
                        no_data,
                        locale: me.loc('AnalyseView.spatial_join.backend_locale')
                    }
                }
            };
            return methodSelections[method];
        },

        /**
         * @private @method _getAggregateLocalization
         *
         * @param {String}  funcKey Aggregate function key
         *
         * @return {String} Localized aggregate function name
         * Get localized name for aggregate function
         */
        _getAggregateLocalization: function (funcKey) {
            const fullKey = 'oskari_analyse_' + funcKey;
            return this.loc('AnalyseView.aggregate.options').find(opt => opt.id === fullKey)?.label;
        },

        /**
         * @private @method _analyseMap
         * Check parameters and execute analyse.
         *
         *
         */
        _analyseMap: function () {
            const sandbox = this.instance.getSandbox();
            const selections = this._gatherSelections();
            const showError = (error)  => {
                const locObj = this.loc('AnalyseView.error');
                this.instance.showMessage(locObj.title, locObj[error] || error);
            };
            // Check that parameters are a-okay
            if (this._checkSelections(selections)) {
                const data = {};
                data.analyse = JSON.stringify(selections);
                data.filter1 = JSON.stringify(this.getFilterJSON(selections.layerId));

                // clip and intersect has target layer
                const targetId = selections.methodParams.layerId;
                if (targetId) {
                    data.filter2 = JSON.stringify(this.getFilterJSON(targetId));
                }
                // if we don't wan't to save data, let's give some data to the grid
                if (this._showFeatureDataWithoutSaving) {
                    data.saveAnalyse = false;
                    const fields = functions;
                    const locales = selections.methodParams.locales;
                    // const noDataCnt = fields.includes('NoDataCnt');

                    fields.unshift('key');
                    locales.unshift(this.loc('AnalyseView.aggregatePopup.property'));
                    this.grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');

                    for (let k = 0; k < locales.length; k += 1) {
                        this.grid.setColumnUIName(fields[k], locales[k]);
                    }
                }

                // clean the "additional info" div
                this.mainPanel.find('div.analysis_additional_info').html('');

                // Send the data for analysis to the backend
                sandbox.postRequestByName('ShowProgressSpinnerRequest', [true]);
                this.instance.analyseService.sendAnalyseData(
                    data,
                    // Success callback
                    (response) => {
                        sandbox.postRequestByName('ShowProgressSpinnerRequest', [false]);
                        if (response) {
                            if (response.error) {
                                showError(response.error);
                            } else {
                                this._handleAnalyseMapResponse(response, noDataCnt);
                            }
                        }
                    },
                    // Error callback
                    (jqXHR, textStatus, errorThrown) => {
                        sandbox.postRequestByName('ShowProgressSpinnerRequest', [false]);
                        showError(textStatus);
                    }
                );
            }
        },

        getFilterJSON: function (layerId) {
            const featureIds = this.instance.getSelectionsForLayer(layerId);
            const { filter } = this.controller.getState();
            if (filter === FILTER.BBOX || featureIds.length === 0) {
                return { bbox: this.instance.getSandbox().getMap().getBbox() };
            }
            return { featureIds };
        },
        /**
         * @private @method _handleAnalyseMapResponse
         * Creates the map layer from the JSON given as a param
         * and adds it to the map and subsequently to be used in further analysis.
         *
         * @param {JSON} analyseJson Layer JSON returned by server.
         * @param {Boolean} noDataCnt True if the amount of authorised features is included in analysis
         *
         */
        _handleAnalyseMapResponse: function (analyseJson, noDataCnt) {
            if (this._showFeatureDataWithoutSaving) {
                this._showAggregateResultPopup(analyseJson, noDataCnt);
                return;
            }
            const service = this.instance.mapLayerService;
            // Create the layer model
            const layer = mapLayerService.createMapLayer(analyseJson);
            // Add the layer to the map layer service
            service.addLayer(layer);
            // Add layer to the map
            const layerId = layer.getId();
            this.instance.getSandbox().postRequestByName('AddMapLayerRequest', [layerId]);

            if (this._showFeatureDataAfterAnalysis) {
                this.instance.getSandbox().postRequestByName('ShowFeatureDataRequest', [layerId]);
            }

            // Remove old layers if any
            if (Array.isArray(analyseJson.mergeLayers)) {
                // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
                // also we need to do it before service.remove() to avoid problems on other components
                analyseJson.mergeLayers.forEach(layerId => this.instance.getSandbox().postRequestByName('RemoveMapLayerRequest', [layerId]));
            }
        },

        /**
         * @private @method _showAggregateResultPopup
         * Shows aggregate analysis results in popup
         *
         * @param {JSON} resultJson Analysis results
         *
         *[{"vaesto": [{"Kohteiden lukumäärä": "324"}, {"Tietosuojattujen kohteiden lukumäärä": "0"},..}]},{"miehet":[..
         * @param {JSON}  geojson geometry of aggregate features union
         * @param {Boolean} noDataCnt True if the amount of authorised features is included in analysis
         *
         */
        _showAggregateResultPopup: function (analyseJson, noDataCnt) {
            const { aggregate, geojson } = analyseJson;
            if (geojson) {
                const { features } = geojson;
                this.instance.sandbox.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [features, {
                    layerId: VECTOR_LAYER_ID,
                    clearPrevious: true,
                    centerTo: false
                }]);
            }
            const popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            const content = this.template.wrapper.clone();
            // Array Array is used for to keep order of rows and cols
            aggregate.forEach(propertyObj => {
                let [key, value] = Object.entries(propertyObj)[0];
                const gridData = value.reduce((data, agg) => {
                        data = { ...data, ...agg };
                        return data;
                    }, { key });
                gridModel.addData(gridData, true);
            });
            gridModel.setIdField('key');
            gridModel.setFirstField('key');
            this.grid.setDataModel(gridModel);

            gridModel.getFields().forEach(field => this.grid.setNumericField(field, LIMITS.decimals));

            this.grid.renderTo(content);

            if (noDataCnt) {
                content.prepend('<div>' + this.loc('AnalyseView.aggregate.footer') + '</div>');
            }

            var storeBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            storeBtn.setTitle(this.loc('AnalyseView.aggregatePopup.store'));
            storeBtn.setTooltip(this.loc('AnalyseView.aggregatePopup.store_tooltip'));
            const onClose = () => {
                this._showFeatureDataWithoutSaving = false;
                this.instance.sandbox.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, VECTOR_LAYER_ID]);
                popup.close(true);
            }
            storeBtn.setHandler(() => {
                // Store temp geometry layer
                const name = this.mainPanel.find('.settings_name_field').val() ? this.mainPanel.find('.settings_name_field').val() : '_';
                const feature = this._getOLGeometry(geojson);
                this.instance.getStateHandler().addTempLayer({ feature, name });
                onClose();
            });

            var closeBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            closeBtn.setTitle(this.loc('AnalyseView.aggregatePopup.close'));
            closeBtn.setHandler(onClose);
            popup.makeDraggable({
                scroll: false,
                cancel: '.content'
            });
            const buttons = geojson ? [storeBtn, closeBtn] : [closeBtn];

            popup.show(this.loc('AnalyseView.aggregatePopup.title'), content, buttons);
        },
        _getSelectedMapLayer: function () {
            return this.controller.getSelectedMapLayer();
        },
        /**
         * @private @method _isNumericField
         * Check if wfs field type is numeric
         *
         * @param fieldName  property name
         *
         */
        _isNumericField: function (name) {
            const layer = this._getSelectedMapLayer();
            if (!layer) {
                return false;
            }
            return layer.getPropertyTypes()[name] === 'number';
        },

        /**
         * @private @method _getNoDataValue
         * Get selected layer's noDataValue value for wps analyse
         * There isn't noDataValue for selected layer, if return value is undefined
         *
         *
         * @return no_data value
         */
        _getNoDataValue: function () {
            const selectedLayer = this._getSelectedMapLayer();
            if (!selectedLayer) {
                return;
            }
            return selectedLayer.getWpsLayerParams().noDataValue;
        },

        /**
         * @private @method _modifyAnalyseName
         * Modify analyse name when analyse layer is changed
         *
         *
         */
        _modifyAnalyseName: function () {
            const layer = this._getSelectedMapLayer();
            if  (!layer) {
                return;
            }
            const name = layer.getName().substring(0, 15) + '_';
            this.mainPanel.find('.settings_name_field').attr({
                'value': name,
                'placeholder': this.loc('AnalyseView.analyse_name.tooltip')
            });
        },

        /**
         * @method showInfos
         * Inform user, if more than 10 fields in analyse input layer
         *
         *
         */
        showInfos: function () {
            const selectedLayer = this._getSelectedMapLayer();
            // No layer selected - nothing to do here
            // No checks for analysis layers
            if (!selectedLayer || isAnalysisLayer(selectedLayer)) {
                return;
            }
            if (selectedLayer.isLayerOfType('userlayer')) {
                this.instance.showMessage(this.loc('AnalyseView.infos.title'), this.loc('AnalyseView.infos.userlayer'));
                // no need to count fields for userlayer
                return;
            }
            const exceedsFieldsCount = Object.keys(selectedLayer.getPropertyTypes()).length > LIMITS.properties;
            if (exceedsFieldsCount) {
                const tooManyFieldsMsg = this.loc('AnalyseView.infos.layer') +
                    ' ' + selectedLayer.getName() +
                    ' ' + this.loc('AnalyseView.infos.over10');
                this.instance.showMessage(this.loc('AnalyseView.infos.title'), tooManyFieldsMsg);
            }
        },

        /**
         * @private @method _checkParamsSelection
         * Check if the selected layer has more fields available
         * than the permitted maximum number and if so,
         * disable the 'all fields' selection.
         *
         *
         */
        _checkParamsSelection: function () {
            const selectedLayer = this._getSelectedMapLayer();
            const exceedsFieldsCount = this._layerHasProperties(selectedLayer)
                && Object.keys(selectedLayer.getPropertyTypes()).length > LIMITS.properties;

            if (exceedsFieldsCount) {
                this._disableAllParamsSelection();
            } else if (selectedLayer) {
                if (isTempLayer(selectedLayer) || selectedLayer.isLayerOfType('userlayer')) {
                    this._disableParamsIfNoList();
                }
            } else {
                this._enableAllParamsSelection();
            }
        },

        _checkMethodSelection: function () {
            const selectedLayer = this._getSelectedMapLayer();
            if (!selectedLayer) {
                return;
            }
            const methodLabels = jQuery('.accordion').find('.method_radiolabel');
            if (isTempLayer(selectedLayer)) {
                this._disableMethodsForTempLayer(methodLabels);
            } else {
                this._enableAllMethods(methodLabels);
            }
        },

        _disableMethodsForTempLayer: function (methodLabels) {
            methodLabels.find('input#oskari_analyse_aggregate').prop('disabled', true).prop('checked', false);
            methodLabels.find('input#oskari_analyse_difference').prop('disabled', true).prop('checked', false);
            methodLabels.find('input#oskari_analyse_buffer').prop('checked', true);
        },

        _enableAllMethods: function (methodLabels) {
            methodLabels.find('input').prop('disabled', false);
        },

        _enableAllParamsSelection: function () {
            var paramsCont = jQuery('.analyse-columns-container');

            paramsCont
                .find('#oskari_analyse_all')
                .prop('disabled', false)
                .prop('checked', true)
                .trigger('change');
        },

        _disableParamsIfNoList: function () {
            var paramsCont = jQuery('.analyse-columns-container');

            paramsCont
                .find('#oskari_analyse_all')
                .prop('disabled', true);

            paramsCont
                .find('#oskari_analyse_select')
                .prop('disabled', true);

            paramsCont
                .find('#oskari_analyse_none')
                .prop('checked', true)
                .trigger('change');
        },

        _disableAllParamsSelection: function () {
            var paramsCont = jQuery('.analyse-columns-container');

            paramsCont
                .find('#oskari_analyse_all')
                .prop('disabled', true);

            paramsCont
                .find('#oskari_analyse_select')
                .prop('checked', true)
                .trigger('change');
        },

        /**
         * @method destroy
         * Destroyes/removes this view from the screen.
         */
        destroy: function () {
            this.mainPanel.remove();
        },

        hide: function () {
            this.mainPanel.hide();
        },

        show: function () {
            this.mainPanel.show();
        },

        setEnabled: function (enabled) {
            this.isEnabled = enabled;
            // only interested for selected/target analysis layer update
            this.instance.getStateHandler().selectedUpdateListeners.push(state => this.refreshAnalyseData(state));
            if (enabled) {
                this.contentPanel.start();
            } else {
                this.contentPanel.stop();
            }
            this.controller.setEnabled(enabled);
        },

        getEnabled: function () {
            return this.isEnabled;
        },

        getState: function () {
            return {}; // TODO: later this._gatherSelections();
        },

        setState: function (formState) {
            return undefined;
        }
    });
