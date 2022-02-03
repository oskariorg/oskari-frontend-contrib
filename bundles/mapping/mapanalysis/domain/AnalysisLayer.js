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
        this._locale = {};
        this._wpsUrl = null;
        this._wpsName = null;
        this._wpsLayerId = null;
    }
    // override to get name from locale
    getName (lang = Oskari.getLang()) {
        const locale = this.getLocale();
        let { name } = locale[lang] || {};
        if (!name) {
            const defaultLocale = locale[Oskari.getDefaultLanguage()] || {};
            name = defaultLocale.name;
        }
        if (name) {
            return Oskari.util.sanitize(name);
        }
        return '';
    }

    getLocale () {
        return this._locale;
    }

    setLocale (locale) {
        this._locale = locale;
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
