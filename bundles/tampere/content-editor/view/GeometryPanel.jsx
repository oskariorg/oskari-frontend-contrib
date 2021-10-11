import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Space } from 'oskari-ui';
import styled from 'styled-components';

export const StyledList = styled('ul')`
    width: 100%:
    list-style-type: none;
`;
export const StyledContainer = styled('div')`
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
`;
export const StyledSpace = styled(Space)`
    width: 100%;
`;

export const StyledListItem = styled('li')`
    padding: 5px;
    border: 1px solid gray;
    border-radius: 3px;
    margin-bottom: 2px;
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;

    :hover {
        background-color: #FDF8D9;
    }
`;

const flatten = (list = []) => {
    let value = list.flat();
    while(value.some(item => Array.isArray(item))) {
        value = value.flat();
    }
    return value;
}

const geometryMatch = (current = {}, original = {}) => {
    const currentList = flatten(current.coordinates);
    const originalList = flatten(original.coordinates);
    if (currentList.length !== originalList.length) {
        return false;
    }
    return currentList.every(item => originalList.includes(item));
}

export const GeometryPanel = ({ type = '', feature = {}, original = {}, startDrawing, updateGeometry}) => {
    const isMulti = type.includes('Multi');
    const isGeomBtnShown = (btnType) => type.includes(btnType);
    useEffect(() => {
        initLayerOnMap();
        return cleanup;
    });
    if (!feature.geometry) {
        return (<Space>
            <Message messageKey="ContentEditorView.geometrylist.empty" />
            
            { isGeomBtnShown('Point') &&
                <Button onClick={() => startDrawing('Point')}>
                    <Message messageKey="ContentEditorView.tools.point" />
                </Button>
            }
            { isGeomBtnShown('LineString') &&
                <Button onClick={() => startDrawing('LineString')}>
                    <Message messageKey="ContentEditorView.tools.line" />
                </Button>
            }
            { isGeomBtnShown('Polygon') &&
                <Button onClick={() => startDrawing('Polygon')}>
                    <Message messageKey="ContentEditorView.tools.area" />
                </Button>
            }
        </Space>);
    }
    // has geometry
    const geometryChanged = !geometryMatch(feature.geometry, original.geometry);
    const updateFeatureGeometry = (feature, geometry) => {
        const newFeature = {
            ...feature,
            geometry: {
                ...geometry
            }
        };
        updateGeometry(newFeature);
    };
    if (!isMulti) {
        // simple geometry (just one)
        return (
            <StyledSpace>
                <StyledContainer>
                    <Message messageKey="ContentEditorView.geometrylist.title" />
                    <Button onClick={() => startDrawing(type)}>
                        <Message messageKey="ContentEditorView.tools.geometryEdit" />
                    </Button>
                </StyledContainer>
                <br />
                {geometryChanged && <StyledContainer>
                    <Message messageKey="ContentEditorView.modified" />
                    <Button type="link" onClick={() => updateFeatureGeometry(feature, original.geometry)}>
                        <Message messageKey="ContentEditorView.restoreOriginal" />
                    </Button>
                </StyledContainer>}
            </StyledSpace>);
    }

    // multi geometry (can remove all but one)
    const onRemove = (feature, indexToRemove) => {
        const newCoords = feature.geometry.coordinates
            .filter((item, index) => index !== indexToRemove);
        updateFeatureGeometry(feature, {
            ...feature.geometry,
            coordinates : newCoords
        });
    };
    return (<React.Fragment>
        <div>
            <StyledSpace direction="vertical">
                <StyledContainer>
                    <Message messageKey="ContentEditorView.geometrylist.title" />
                    <Button onClick={() => startDrawing(type)}>
                        <Message messageKey="ContentEditorView.tools.geometryEdit" />
                    </Button>
                </StyledContainer>
                { isMulti && <StyledList>
                    {feature.geometry.coordinates.map((feat, index) => {
                        return (<GeometryRow 
                            feature={feature}
                            index={index}
                            type={type}
                            onRemove={onRemove}
                            key={JSON.stringify(feat)} />);
                    })}
                </StyledList> }
                {geometryChanged && <StyledContainer>
                    <Message messageKey="ContentEditorView.modified" />
                    <Button type="link" onClick={() => updateFeatureGeometry(feature, original.geometry)}>
                        <Message messageKey="ContentEditorView.restoreOriginal" />
                    </Button>
                </StyledContainer>}
            </StyledSpace>
        </div>
    </React.Fragment>);
};

const LAYER_NAME = 'ContentEditorPreview';
const initLayerOnMap = () => {
    Oskari.getSandbox().postRequestByName('VectorLayerRequest', [{
        "layerId": LAYER_NAME,
        "opacity": 75,
        "hover": {
          "featureStyle": {
            "fill": {
              "color": "#ff00ff"
            },
            "stroke": {
              "color": "#000000"
            }
          }
        }
      }]);
}
const cleanup = () => {
    Oskari.getSandbox().postRequestByName('VectorLayerRequest', [{
        layerId: LAYER_NAME,
        remove: true
      }]);
}

const wrapToCollection = (feature) => {
    return {
        "type": "FeatureCollection",
        "features": [
          {
              ...feature
          }
        ]
      };
}

const addToMap = (geojson) => {
    Oskari.getSandbox().postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', 
    [geojson, {
        layerId: LAYER_NAME,
        'clearPrevious': true
    }]);
}
const removeFromMap = () => {
    Oskari.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', 
    [null, null, LAYER_NAME]);
    //['test_property', 1, LAYER_NAME]);
}
const onMouseEnter = (feature, index) => {
    const partialFeature = {
        ...feature,
        geometry: {
            ...feature.geometry,
            coordinates: [
                feature.geometry.coordinates[index]
            ]
        },
        properties: {
            ...feature.properties,
            isNew: true
        }
    }
    addToMap(wrapToCollection(partialFeature));
}

const onMouseOut = (feature, index) => {
    removeFromMap();
}

const GeometryRow = ({feature, type, index, onRemove}) => {
    let onlyGeometry = feature.geometry.coordinates.length === 1;
    let simpleType = type.replace('Multi', '');
    return (
        <StyledListItem
            onMouseEnter={() => onMouseEnter(feature, index)}
            onMouseLeave={() => onMouseOut(feature, index)}>
            <Message messageKey={ "ContentEditorView.geometrylist." + simpleType }> {index + 1}</Message>
            <Button disabled={onlyGeometry}
                type="dashed" danger
                onClick={() => onRemove(feature, index)}>
                    <Message messageKey="ContentEditorView.buttons.delete" />
            </Button>
        </StyledListItem>);
};


GeometryPanel.propTypes = {
    type: PropTypes.string,
    feature: PropTypes.object,
    original: PropTypes.object,
    startDrawing: PropTypes.func,
    updateGeometry: PropTypes.func
};
