/**
 * @class Oskari.analysis.bundle.analyse.view.StartAnalyse.validationMethods
 *
 * Adds validation methods to the StartAnalyse class.
 */
Oskari.clazz.category(
    'Oskari.analysis.bundle.analyse.view.StartAnalyse',
    'validation-methods', {

        /**
         * Validates analyse selection parameters
         *
         * @method _checkSelections
         * @private
         * @param {Object} selections Selections to validate
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _checkSelections: function (selections) {
            if (!selections) {
                this._notifyValidationError('noParameters', 'title');
                return false;
            }
            const { layerId, method } = selections;
            if (!layerId) {
                this._notifyValidationError('noLayer');
                return false;
            }
            const methodValidator = this['_validate_method_' + method];
            if (!methodValidator) {
                this._notifyValidationError('invalidMethod');
                return false;
            }
            return methodValidator.call(this, selections);
        },

        /**
         * Validates selections for analysis method buffer
         *
         * @method _validate_method_buffer
         * @private
         * @param {Object} selections Selections for output JSON
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_buffer: function (selections) {
            const bufferSize = selections.methodParams.distance;
            if (bufferSize === '') {
                this._notifyValidationError('bufferSize');
                return false;
            }
            if (isNaN(bufferSize)) {
                this._notifyValidationError('illegalCharacters');
                return false;
            }
            const num = Number(bufferSize);
            if (num > -1 && num < 1) {
                this._notifyValidationError('bufferSize');
                return false;
            }
            return true;
        },
        /**
         * Validates selections for analysis method aggregate
         *
         * @method _validate_method_aggregate
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_aggregate: function (selections) {
            const { functions } = selections.methodParams || [];
            if (functions.length === 0) {
                this._notifyGenerigError('Aggregate functions not selected');
                return false;
            }
            return true;
        },

        /**
         * Validates selections for analysis method union
         *
         * @method _validate_method_union
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_union: function (selections) {
            return true;
        },

        /**
         * Validates selections for analysis method clip
         *
         * @method _validate_method_clip
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_clip: function (selections) {
            if (!selections.methodParams.layerId) {
                this._notifyGenerigError('Clipping layer is not selected');
                return  false;
            }
            return true;
        },
        /**
         * Validates selections for analysis method intersect
         *
         * @method _validate_method_intersect
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_intersect: function (selections) {
            if (!selections.methodParams.layerId) {
                this._notifyGenerigError('Intersecting layer is not selected');
                return false;
            } else if (selections.layerId == selections.methodParams.layerId) {
                this._notifyGenerigError('No intersections to itself');
                return false;
            }
            return true;
        },
        /**
         * Validates selections for analysis method intersect
         *
         * @method _validate_method_layer_union
         * @param  {Object} selections Selections for output JSON
         * @param  {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_layer_union: function (selections) {
            if (!selections.methodParams.layers) {
                this._notifyValidationError('noLayer');
                return false;
            }
            if (selections.methodParams.layers && selections.methodParams.layers.length < 2) {
                this._notifyValidationError('noAnalyseUnionLayer');
                return false;
            }
            return true;
        },

        /**
         * Validates selections for analysis method areas and sectors
         *
         * @method _validate_method_areas_and_sectors
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_areas_and_sectors: function (selections) {
            // FIXME add validation once we know:
            // - which fields are mandatory
            // - what are the allowed ranges
            return true;
        },

        /**
         * Validates selections for analysis method difference
         *
         * @method _validate_method_difference
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_difference: function (selections) {
            if (!selections.methodParams.layerId) {
                this._notifyGenerigError('Second layer is not selected');
                return false;
            }
            if (!selections.methodParams.fieldA1) {
                this._notifyGenerigError('First layer\'s field is not selected');
                return false;
            }
            if (!selections.methodParams.fieldB1) {
                this._notifyGenerigError('Second layer\'s field is not selected');
                return false;
            }
            if (!selections.methodParams.keyA1 || !selections.methodParams.keyB1) {
                this._notifyGenerigError('Key field is not selected');
                return false;
            }
            return true;
        },

        /**
         * Validates selections for analysis method difference
         *
         * @method _validate_method_difference
         * @private
         * @param {Object} selections Selections for output JSON
         * @param {String} errorTitle Error title to display to the user
         * @return {Boolean} returns true if no validation errors, false otherwise
         */
        _validate_method_spatial_join: function (selections) {
            if (!selections.methodParams.layerId) {
                this._notifyGenerigError('Second layer is not selected');
                return false;
            }
            if (!selections.layerId) {
                this._notifyGenerigError('First layer is not selected');
                return false;
            }

            if (!selections.methodParams.featuresA1 && !selections.methodParams.featuresA1) {
                this._notifyGenerigError('No features selected');
                return false;
            }
            return true;
        },

        /**
         * Notifies the user of a validation error.
         *
         * @method _notifyValidationError
         * @private
         * @param {String} msgKey Message to display
         * @param {String} titleKey Title for the pop-up
         *        (optional, uses default error title if not provided)
         */
        _notifyValidationError: function (msgKey, titleKey = 'invalidSetup') {
            const title = this.loc(`AnalyseView.error.${titleKey}`);
            const msg = this.loc(`AnalyseView.error.${msgKey}`);
            this.instance.showMessage(title, msg);
        },
        _notifyGenerigError: function (cause) {
            this._notifyValidationError('invalidSetup', 'title');
            Oskari.log(this.instance.getName()).warning(cause);
        }
    });
