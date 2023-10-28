import { isUserLayer, getProperties } from '../service/AnalyseHelper';
import { LIMITS, PROPERTIES, BUFFER, BUNDLE_KEY, AGGREGATE_OPTIONS, SPATIAL_OPTIONS } from '../constants';

export const getInitPropertiesSelections = (method, layer) => {
    let type = PROPERTIES.ALL;
    let selected = getProperties(layer);
    if (!selected.length) {
        type = PROPERTIES.NONE;
        // There should be one propertety in filter - in other case all properties are retreaved by WPS
        // Add feature_id field for userlayer (can't use normal fields because them values are inside property_json)
        // TODO: hasPreProcessedProperties etc to get rid of userlayer
        if (isUserLayer(layer)) {
            selected = ['feature_id'];
        }
    } else if (selected.length > LIMITS.properties) {
        type = PROPERTIES.SELECT;
        // auto-select
        if (method === 'aggregate') {
            selected = selected.filter(prop => propTypes[prop] === 'number');
        } else {
            selected = selected.slice(0, LIMITS.properties);
        }
    }
    return { type, selected };
};

export const getInitMethodParams = (method, layer, targetLayer) => {
    if (method === 'buffer' || method === 'areas_and_sectors') {
        return { size: 0, unit: Object.keys(BUFFER)[0] };
    }
    if (method === 'aggregate') {
        return { functions: [...AGGREGATE_OPTIONS] };
    }
    if (method === 'intersect') {
        return { operator: SPATIAL_OPTIONS[0] }
    }
    if (method === 'intersect') {
        return { operator: SPATIAL_OPTIONS[0] }
    }
    // difference validates params on gatherSelections
    // others doesn't require selections
    return {};
};

export const gatherMethodParams = state => {
    const { method, methodParams, targetLayer: layerId } = state;
    const no_data = ''; //TODO:
    if (method === 'buffer') {
        const { size, unit } = methodParams;
        return {
            distance: size * BUFFER[unit]
        };
    }
    if (method === 'areas_and_sectors') {
        const { size, unit, ...rest } = methodParams;
        return {
            areaDistance: size * BUFFER[unit],
            ...rest
        };
    }
    if (method === 'layer_union') {
        return {
            layers: []
        };
    }

    const common = { no_data, layerId };
    if (method === 'difference') {
        // difference validates params on gatherSelections
        const { property, targetProperty, joinKey } = methodParams;
        return {
            fieldA1: property,
            fieldB1: targetProperty,
            keyA1: joinKey,
            keyB1: joinKey,
            ...common
        };
    }
    if (method === 'spatial_join') {
        return {
            featuresA1: [],
            featuresB1: [],
            locale: Oskari.getMsg(BUNDLE_KEY, 'AnalyseView.spatial_join.backend_locale'),
            ...methodParams,
            ...common
        }
    }
    if (method === 'aggregate') {
        const { functions, ...rest } = methodParams;
        const loc = func => Oskari.getMsg(BUNDLE_KEY, `${func}`);
        return {
            functions,
            locales: functions.map(func => loc(func)),
            ...rest,
            ...common
        };
    }
    if (method === 'clip' || method === 'intersect') {
        return {
            features: [],
            ...methodParams,
            ...common
        };
    }
    // 'union'
    return common;
};
