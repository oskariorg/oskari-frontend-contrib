import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';
import olInteractionSelect from 'ol/interaction/Select';
import { pointerMove as conditionPointerMove } from 'ol/events/condition';
import olFeature from 'ol/Feature';
import { Point as olGeomPoint } from 'ol/geom';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import { COLORS } from '../view/constants';

const ANALYSIS_LAYER_TYPE = 'analysislayer';
const TEMP_LAYER_TYPE = 'temp';
const LAYER_SEQ =  'analysisTempLayer'
const UNSUPPORTED_WFS = ['2.0.0', '3.0.0'];

export const eligibleForAnalyse = (layer) => {
    if (layer.isLayerOfType(TEMP_LAYER_TYPE)) {
        return true;
    }
    return layer.hasFeatureData() && !isUnsupportedWFS(layer);
}

export const isUnsupportedWFS = (layer) => {
    return layer.getLayerType() === 'wfs' && UNSUPPORTED_WFS.includes(layer.getVersion());
};

export const isAnalysisLayer = (layer) => {
    if (!layer) {
        return false;
    }
    return layer.isLayerOfType(ANALYSIS_LAYER_TYPE);
};

export const isTempLayer = (layer) => {
    return layer.isLayerOfType(TEMP_LAYER_TYPE);
};

export const getRandomizedStyle = () => {
    const index = Math.floor(Math.random() * (COLORS.length - 1))
    const color = COLORS[index];
    const style = {
        fill: { color: FILL_COLORS[index] },
        image : { fill: { color } },
        stroke: {
            color,
            area : { color }
        }
    };
    return jQuery.extend(true, {}, Oskari.custom.generateBlankStyle(), style)
};

export const createFeatureLayer = () => {
    const layer = new olLayerVector({
        title: 'AnalyseFeatureLayer',
        source: new olSourceVector(),
        style: new olStyleStyle({
            fill: new olStyleFill({
                color: 'rgba(92, 176, 219, 0.5)'
            }),
            stroke: new olStyleStroke({
                color: '#3399CC',
                width: 3
            }),
            image: new olStyleCircle({
                radius: 4,
                fill: new olStyleFill({
                    color: '#3399CC'
                })
            })
        })
    });
    return layer;
};

const createHoverInteraction = layer => {
    const hoverInteraction = new olInteractionSelect({
        condition: conditionPointerMove,
        style: new olStyleStyle({
            stroke: new olStyleStroke({
                color: '#257ba8',
                width: 3
            }),
            fill: new olStyleFill({
                color: 'rgba(92, 176, 219, 0.8)'
            }),
            image: new olStyleCircle({
                radius: 4,
                fill: new olStyleFill({
                    color: '#257ba8'
                })
            })
        })
    });
    return hoverInteraction;
};

const createSelectInteraction = (layer) => {
    var selectInteraction = new olInteractionSelect({
        style: new olStyleStyle({
            stroke: new olStyleStroke({
                color: 'rgba(21, 6, 232, 1)',
                width: 3
            }),
            fill: new olStyleFill({
                color: 'rgba(21, 6, 232, 0.4)'
            }),
            image: new olStyleCircle({
                radius: 4,
                fill: new olStyleFill({
                    color: 'rgba(21, 6, 232, 1)'
                })
            })
        })
    });
    return selectInteraction;
};

export const createPointFeature = ({ lon, lat }) => {
    return olFeature({
        geometry: new olGeomPoint([lon, lat])
    });
};

export const getDrawRequestType = (internalGeometryType) => {
    if (internalGeometryType === 'line') {
        return 'LineString';
    } else if (internalGeometryType === 'area') {
        return 'Polygon';
    }
    return 'Point';
};

const getSimpleGeometryType = (type = '') => {
    if (type.includes('Line')) {
        return 'line';
    } else if (type.includes('Polygon')) {
        return 'area';
    }
    return 'point';
};

export const createTempLayer = ({ name: optName, feature }) => {
    const id = Oskari.getSeq(LAYER_SEQ).nextVal();
    const geometryType = getSimpleGeometryType(feature.getGeometry().getType());
    const name = optName || Oskari.getMsg('Analyse', `AnalyseView.content.features.modes.${geometryType}`) + ' ' + id;
    return {
        getId: () => LAYER_SEQ + '_' + id,
        getName: () => name,
        isLayerOfType: type => type === TEMP_LAYER_TYPE,
        getLayerType: () => TEMP_LAYER_TYPE,
        getGeometryType: () => geometryType,
        hasFeatureData: () => false,
        getWpsLayerParams: ()  => ({}),
        getPropertyTypes: ()  => ({}),
        getPropertyLabels: ()  => ({}),
        getOpacity: () => 100,
        getFeature: () => feature,
        getVersion: () => '0.0.1', // Version is added just to make fake layer compatible with other layers
        getMetadataIdentifier: () => null,
        getFeatureAsGeoJSON: () => {
            const json = new olFormatGeoJSON().writeFeatureObject(feature);
            json.properties = {};
            return json;
        }
    };
};
