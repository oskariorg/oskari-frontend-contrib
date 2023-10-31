import { Messaging } from 'oskari-ui/util';
import { isUserLayer, getProperties, isTempLayer } from '../service/AnalyseHelper';
import { LIMITS, PROPERTIES, BUFFER, BUNDLE_KEY, AGGREGATE_OPTIONS, SPATIAL_OPTIONS, SPATIAL_JOIN_MODES, METHOD_OPTIONS } from '../constants';

export const showInfosForLayer = layer => {
    const loc = (key, args={}) => Oskari.getMsg(BUNDLE_KEY, `AnalyseView.infos.${key}`, args);
    if (!layer) {
        return;
    }
    // TODO: hasPreProcessedProperties etc to get rid of userlayer
    if (isUserLayer(layer)) {
        Messaging.info(loc('userlayer'));
    }
    if (getProperties(layer).length > LIMITS.properties) {
        Messaging.info(loc('layer') + ' ' + layer.getName() + ' ' + loc('over10', {limit: LIMITS.properties}));
    }
};

export const getInitPropertiesSelections = (method, layer) => {
    let type = PROPERTIES.ALL;
    let selected = getProperties(layer);
    const {autoSelectNumbers} = METHOD_OPTIONS[method] || {};
    if (!selected.length) {
        type = PROPERTIES.NONE;
    } else if (selected.length > LIMITS.properties || autoSelectNumbers) {
        type = PROPERTIES.SELECT;
        selected = _autoSelectProperties(layer, autoSelectNumbers);
    }
    return { type, selected };
};
const _autoSelectProperties = (layer, numberTypes) => {
    let properties = getProperties(layer);
    if (numberTypes) {
        const propTypes = layer?.getPropertyTypes() || {};
        properties =  properties.filter(prop => propTypes[prop] === 'number');
    }
    return properties.slice(0, LIMITS.properties);
};

export const getInitMethodParams = (method, layer, targetLayer) => {
    if (method === 'buffer' || method === 'areas_and_sectors') {
        return { size: 0, unit: Object.keys(BUFFER)[0] };
    }
    if (method === 'aggregate') {
        return { operators: [...AGGREGATE_OPTIONS] };
    }
    if (method === 'intersect') {
        return { operator: SPATIAL_OPTIONS[0] }
    }
    if (method === 'spatial_join') {
        return {
            properties: _autoSelectProperties(layer),
            targetProperties: _autoSelectProperties(targetLayer),
            mode: SPATIAL_JOIN_MODES[0]
        };
    }
    // difference validates params on gatherSelections
    // others doesn't require selections
    return {};
};

export const gatherMethodParams = (state, layer, targetLayer) => {
    const { method, methodParams, targetId } = state;
    if (method === 'union') {
        return {};
    }
    const { noData } = layer.getWpsLayerParams();
    const common = { no_data: noData };
    if (method === 'buffer') {
        const { size, unit } = methodParams;
        return {
            distance: size * BUFFER[unit],
            ...common
        };
    }
    if (method === 'areas_and_sectors') {
        const { size, unit, areaCount, sectorCount } = methodParams;
        return {
            areaDistance: size * BUFFER[unit],
            areaCount,
            sectorCount,
            ...common
        };
    }
    if (method === 'aggregate') {
        const { operators } = methodParams;
        const loc = op => Oskari.getMsg(BUNDLE_KEY, `AnalyseView.aggregate.options.${op}`);
        // TODO: is attribute needed?
        return {
            functions: operators,
            locales: operators.map(op => loc(op)),
            ...common
        };
    }
    if (method === 'layer_union') {
        return {
            layers: [targetId],
            ...common
        };
    }
    // add target layerId for rest
    const targetIsTemp = isTempLayer(targetLayer);
    common.layerId = targetIsTemp ? '-1' : targetId;
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
        const { properties, targetProperties, mode } = methodParams;
        return {
            featuresA1: properties,
            featuresB1: targetProperties,
            locale: Oskari.getMsg(BUNDLE_KEY, 'AnalyseView.spatial_join.backend_locale'),
            operator: mode,
            ...common
        }
    }
    if (method === 'clip' || method === 'intersect') {
        const { operator } = methodParams;
        const features = targetIsTemp ? [targetLayer.getFeatureAsGeoJSON()] : [];
        return {
            features,
            operator,
            ...common
        };
    }
    return {};
};
