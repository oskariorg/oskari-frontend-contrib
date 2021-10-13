/**
 * @class Oskari.analysis.bundle.analyse.view.StartView
 * Starts analyse mode for users that are logged in.
 *  This is an initial screen for analyse methods and for user information
 */
Oskari.clazz.define('Oskari.analysis.bundle.analyse.view.StartView',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance} instance
     *      reference to component that created this view
     * @param {Object} localization
     *      localization data in JSON format
     */

    function (instance, localization) {
        this.instance = instance;
        this.template = jQuery(
            '<div class="startview">' +
            '  <div class="content"></div>' +
            '  <div class="buttons"></div>' +
            '</div>'
        );
        this.templateError = jQuery(
            '<div class="error">' +
            '  <ul></ul>' +
            '</div>'
        );
        this.templateAnalyseInfo = jQuery(
            '<div class="analyse-info" style="padding: 10px;">' +
            '</div>'
        );
        this.templateInfo = jQuery('<div class="icon-info"></div>');
        this.checkboxTemplate = jQuery(
            '<input type="checkbox" name="analyse_info_seen" id="analyse_info_seen" value="1">'
        );
        this.layerLabelTemplate = jQuery('<div class="analyse-startview-label"><label for="layersWithSelectedFeatures"></label></div>');
        this.layerList = jQuery(
            '<div class="analyse-featurelist" id="layersWithSelectedFeatures">' +
            '  <ul></ul>' +
            '</div>' +
            '</div>'
        );
        this.layerListRadioElement = jQuery(
            '<li>' +
            '  <label>' +
            '    <input name="layerListElement" type="radio" />' +
            '    <span></span>' +
            '  </label>' +
            '</li>'
        );
        this.labelTemplate = jQuery('<label for="analyse_info_seen"></label>');
        this.loc = localization;
        this.appendAlwaysCheckbox = true;
        this.content = undefined;
        this.buttons = {};
        this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');
    }, {
        /**
         * @method render
         * Renders view to given DOM element
         * @param {jQuery} container reference to DOM element this component will be
         * rendered to
         */
        render: function (container) {
            var me = this,
                content = this.template.clone();
            this.content = content;
            container.append(content);

            const startInfo = this.templateAnalyseInfo.clone();
            startInfo.append(this.loc.text);
            container.prepend(startInfo);

            const discounted = this.templateAnalyseInfo.clone();
            discounted.append(this.loc.discountedNotice);
            container.prepend(discounted);

            // in analyse mode features can be selected only from one layer at once
            // check if user have selections from many layers and notify about it
            this.renderRemoveFeatureSelections();

            var cancelButton = Oskari.clazz.create(
                'Oskari.userinterface.component.buttons.CancelButton'
            );

            cancelButton.setId('oskari_analysis_analyse_view_start_view_buttons_cancel');
            cancelButton.setHandler(function () {
                me.instance.sandbox.postRequestByName(
                    'userinterface.UpdateExtensionRequest',
                    [me.instance, 'close']
                );
            });
            this.buttons.cancel = cancelButton;

            cancelButton.insertTo(content.find('div.buttons'));
            
            var continueButton = Oskari.clazz.create(
                'Oskari.userinterface.component.Button'
            );
            continueButton.addClass('primary');
            continueButton.setId('oskari_analysis_analyse_view_start_view_buttons_continue');
            continueButton.setTitle(this.loc.buttons['continue']);
            continueButton.setHandler(function () {
                me.emptySelectionsFromLayers.forEach(layerId => me.instance.emptySelections(layerId));
                me.instance.enableAnalyseMode();
            });
            this.buttons['continue'] = continueButton;
            continueButton.insertTo(content.find('div.buttons'));
            if (me.appendAlwaysCheckbox) {
                content.append('<br><br>');
                var checkbox = this.checkboxTemplate.clone(),
                    label = this.labelTemplate.clone();
                label.append(me.loc.infoseen.label);
                checkbox.on(
                    'change',
                    function () {
                        if (jQuery(this).prop('checked')) {
                            // Set cookie not to show analyse info again
                            jQuery.cookie(
                                'analyse_info_seen',
                                '1',
                                {
                                    expires: 365
                                }
                            );
                        } else {
                            // Revert to show guided tour on startup
                            jQuery.cookie(
                                'analyse_info_seen',
                                '0',
                                {
                                    expires: 1
                                }
                            );
                        }
                    }
                );
                content.append(checkbox);
                content.append('&nbsp;');
                content.append(label);
            }
        },

        renderRemoveFeatureSelections: function () {
            var me = this;
            const layersWithSelections = this.instance.getLayerIdsWithSelections();
            this.emptySelectionsFromLayers =  [];
            if (layersWithSelections.length <= 1) {
                return;
            }
            const layerList = this.layerList.clone();
            const labelTemplate = this.layerLabelTemplate.clone();
            labelTemplate.find('label').append(this.loc.layersWithFeatures);
            layersWithSelections.forEach(layerId => {
                const layerListRadioElement = this.layerListRadioElement.clone();
                layerListRadioElement
                    .find('input')
                    .val(layerId);

                layerListRadioElement
                    .find('span')
                    .html(this.getLayerName(layerId));

                layerList.find('ul').append(layerListRadioElement);
                }
            );
            layerList.find('input').first().prop('checked', true);
            this.emptySelectionsFromLayers = layersWithSelections.slice(1);

            jQuery(layerList).find('input').on('click', function (el) {
                const selectedStr = el.currentTarget.value;
                const selectedId = isNaN(selectedStr) ? selectedStr : Number(selectedStr);
                me.emptySelectionsFromLayers = layersWithSelections.filter(layerId => layerId !== selectedId);
            });
            this.content.find('div.content').append(labelTemplate);
            this.content.find('div.content').append(layerList);
        },

        getLayerName: function (layerId) {
            const layer = this.instance.sandbox.findMapLayerFromSelectedMapLayers(layerId);
            return layer ? layer.getName() : '';
        }

    });
