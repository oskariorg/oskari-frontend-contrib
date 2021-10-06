import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Space } from 'oskari-ui';
import styled from 'styled-components';

export const StyledList = styled('ul')`
    padding-left: 30px;
`;


export const GeometryPanel = ({ type = '', feature = {}, startDrawing, updateGeometry}) => {
    const isMulti = type.includes('Multi');
    const isGeomBtnShown = (btnType) => type.includes(btnType);
    const onRemove = (feature, indexToRemove) => {
        const newCoords = feature.geometry.coordinates
            .filter((item, index) => index !== indexToRemove);
        const newFeature = {
            ...feature,
            geometry: {
                ...feature.geometry,
                coordinates : newCoords
            }
        };
        updateGeometry(newFeature);
    };
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
    if (!isMulti) {
        // TODO: muokkausnappi?
        return (
            <Space>
                <Message messageKey="ContentEditorView.geometrylist.title" />
                <Button onClick={() => startDrawing(type)}>
                    <Message messageKey="ContentEditorView.tools.geometryEdit" />
                </Button>
            </Space>);
    }
    return (<React.Fragment>
        <div>
            <Space direction="vertical">
                <Space>
                    <Message messageKey="ContentEditorView.geometrylist.title" />
                    <Button onClick={() => startDrawing(type)}>
                        <Message messageKey="ContentEditorView.tools.geometryEdit" />
                    </Button>
                </Space>
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
            </Space>
        </div>
    </React.Fragment>);
};

const GeometryRow = ({feature, type, index, onRemove}) => {
    let onlyGeometry = feature.geometry.coordinates.length === 1;
    let simpleType = type.replace('Multi', '');
    return (
        <li>
            <Space>
                <Message messageKey={ "ContentEditorView.geometrylist." + simpleType }> {index + 1}</Message>
                <Button disabled={onlyGeometry}
                    type="dashed" danger
                    onClick={() => onRemove(feature, index)}>
                        <Message messageKey="ContentEditorView.buttons.delete" />
                </Button>
            </Space>
        </li>);
};


GeometryPanel.propTypes = {
    type: PropTypes.string,
    feature: PropTypes.object,
    startDrawing: PropTypes.func,
    updateGeometry: PropTypes.func
};