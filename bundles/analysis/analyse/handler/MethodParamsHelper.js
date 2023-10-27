import { isTempLayer } from '../service/AnalyseHelper';
import { LIMITS, PROPERTIES } from '../constants';

export const getInitPropertiesSelections = (layer, selected) => {
    let type = PROPERTIES.ALL;
    if (isTempLayer(layer) || isUserLayer(layer)) {
        type = PROPERTIES.NONE;
        selected = isUserLayer(layer) ? [''] : [];
        return { type, selected };
    }
    const props = Object.keys(layer.getPropertyTypes());
    let selected = props;
    if (props.length > LIMITS.properties) {
        type = PROPERTIES.SELECT;
        // auto-select
    }
    return { type, selected };
}

export const gatherMethodParams = state => {
    const { method } = state;
    if (method === 'buffer') {
        return {
            distance: bufferSize,
            no_data
        };
    }
    if (method === 'aggregate') {
        return {
            functions: aggregateFunctions, // TODO: param name?
            locales: aggregateFunctions.map(func => this._getAggregateLocalization(func)),
            attribute: aggregateAttribute,
            no_data
        };
    }
    if (method === 'union') {
        return {
            layerId: unionLayerId,
            no_data
        };
    };
    if (method === 'clip') {
        // method: 'intersect', // use intersect method for clip
        return {
            layerId: intersectLayerId,
            features: intersectFeatures,
            operator: spatialOperator,
            no_data
        };
    }
    if (method === 'intersect') {
        return {
            layerId: intersectLayerId,
            operator: spatialOperator, // TODO: param name?
            features: intersectFeatures,
            no_data
        };
    }
    if (method === 'layer_union') {
        return {
            layers: layerUnionLayers
        };
    }
    if (method === 'areas_and_sectors') {
        //override_sld: 'sld_label_t1', // TODO: is this really needed?
        return {
            areaCount: areaCount,
            areaDistance: areaSize,
            sectorCount: sectorCount
        };
    }
    if (method === 'difference') {
        //override_sld: 'sld_muutos_n1', // TODO: is this really needed?
        return {
            layerId: differenceLayerId,
            fieldA1: differenceFieldA1,
            fieldB1: differenceFieldB1,
            keyA1: keyField,
            keyB1: keyField,
            no_data
        };
    }
    if (method === 'spatial_join') {
        return {
            layerId: differenceLayerId,
            featuresA1: featuresA1,
            featuresB1: featuresB1,
            operator: spatialOperator,
            no_data,
            locale: me.loc('AnalyseView.spatial_join.backend_locale')
        }
    }
    return {};
};