import { isUserLayer } from '../service/AnalyseHelper';
import { LIMITS, PROPERTIES, BUFFER, BUNDLE_KEY } from '../constants';

export const getInitPropertiesSelections = (layer, method) => {
    // HACK!!
    // There should be one propertety in filter - in other case all properties are retreaved by WPS
    // Userlayer has forced selection for no properties => fields is empty array
    // Add feature_id field (can't use normal fields because them values are inside property_json)
     // TODO: hasPreProcessedProperties etc to get rid of userlayer
    if (!layer || isUserLayer(layer)) {
        return {
            type: PROPERTIES.NONE,
            selected: layer ? ['feature_id'] : []
        };
    }
    let type = PROPERTIES.ALL;
    const propTypes = layer.getPropertyTypes();
    let selected = Object.keys(propTypes);
    if (!selected.length) {
        type = PROPERTIES.NONE;
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

export const getInitMethodParams = (layer, targetLayer, method) => {
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
        const { areaSize, areUnit, ...rest } = methodParams;
        return {
            areaDistance: areaSize * BUFFER[areUnit],
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
