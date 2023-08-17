import { UserDataLayer } from 'oskari-frontend/bundles/mapping/mapuserdatalayer/domain/UserDataLayer';
/**
 * @class Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer
 *
 * MapLayer of type Analysis
 */
export class AnalysisLayer extends UserDataLayer {
    constructor () {
        super(...arguments);
        /* Layer Type */
        this._layerType = 'analysislayer'; // 'ANALYSIS';
        this._metaType = 'ANALYSIS';
    }
};

Oskari.clazz.defineES('Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer', AnalysisLayer);
