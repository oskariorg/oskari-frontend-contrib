const WFSLayer = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer');
/**
 * @class Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer
 *
 * MapLayer of type Analysis
 */
export class AnalysisLayer extends WFSLayer {
    constructor () {
        super(...arguments);
        /* Layer Type */
        this._layerType = 'analysislayer'; // 'ANALYSIS';
        this._metaType = 'ANALYSIS';
    }
    /**
     * Sets the WPS url where the layer images are fetched from
     *
     * @method setWpsUrl
     * @param {String} url
     */
    setWpsUrl (url) {
        this._wpsUrl = url;
    }
    /**
     * Gets the WPS url
     *
     * @method getWpsUrl
     * @return {String} the url for wps service
     */
    getWpsUrl () {
        return this._wpsUrl;
    }
    /**
     * @method setWpsName
     * @param {String} wpsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    setWpsName (wpsName) {
        this._wpsName = wpsName;
    }
    /**
     * @method getWpsName
     * @return {String} wpsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    getWpsName () {
        return this._wpsName;
    }
    /**
     * @method setWpsLayerId
     * @param {String} wpsLayerId used to identify the right analysis result
     */
    setWpsLayerId (wpsLayerId) {
        this._wpsLayerId = wpsLayerId;
    }

    /**
     * @method getWpsLayerId
     * @return {String}
     */
    getWpsLayerId () {
        return this._wpsLayerId;
    }
    /**
     * @method setOverrideSld
     * @param {String} override_sld override sld style name in geoserver
     */
    setOverrideSld (override_sld) {
        this._override_sld = override_sld;
    }
    /**
     * @method  getOverrideSld override sld style name in geoserver
     * @return {String}
     */
    getOverrideSld () {
        return this._override_sld;
    }
    isFilterSupported () {
        return true;
    }
};

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer', AnalysisLayer);
