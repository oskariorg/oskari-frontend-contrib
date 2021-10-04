import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Tooltip } from 'oskari-ui';


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
        // TODO: Maybe the draw tools?
        return (<React.Fragment>
            { isGeomBtnShown('Point') &&
                <Tooltip title={<Message messageKey="ContentEditorView.tools.point" />}>
                    <div className="add-point tool" onClick={() => startDrawing('Point')}></div>
                </Tooltip>
            }
            { isGeomBtnShown('LineString') &&
                <Tooltip title={<Message messageKey="ContentEditorView.tools.line" />}>
                    <div className="add-line tool" onClick={() => startDrawing('LineString')}></div>
                </Tooltip>
            }
            { isGeomBtnShown('Polygon') &&
                <Tooltip title={<Message messageKey="ContentEditorView.tools.area" />}>
                    <div className="add-area tool" onClick={() => startDrawing('Polygon')}></div>
                </Tooltip>
            }
        </React.Fragment>);
    }
    if (!isMulti) {
        // TODO: muokkausnappi?
        return;
    }
    return (<React.Fragment>
        <div>
            Geometriat:
            <Tooltip title={<Message messageKey="ContentEditorView.tools.geometryEdit" />}>
                <Button onClick={() => startDrawing(type)}><Message messageKey="ContentEditorView.tools.geometryEdit" /></Button>
            </Tooltip>
            <ol>
            {feature.geometry.coordinates.map((feat, index) => {
                return (<GeometryRow 
                    feature={feature}
                    index={index}
                    onRemove={onRemove}
                    key={JSON.stringify(feat)} />);
            })}
            </ol>
        </div>
    </React.Fragment>);
};

const GeometryRow = ({feature, index, onRemove}) => {
    const onlyGeometry = feature.geometry.coordinates.length === 1;
    return (
        <li>
            {index}
            <Button disabled={onlyGeometry} onClick={() => onRemove(feature, index)}><Message messageKey="ContentEditorView.buttons.delete" /></Button>
        </li>);
};


GeometryPanel.propTypes = {
    type: PropTypes.string,
    feature: PropTypes.object,
    startDrawing: PropTypes.func,
    updateGeometry: PropTypes.func
};