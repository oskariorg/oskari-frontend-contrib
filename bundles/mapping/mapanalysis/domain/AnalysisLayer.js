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
        this._wpsUrl = null;
        this._wpsName = null;
        this._wpsLayerId = null;
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
};

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer', AnalysisLayer);
