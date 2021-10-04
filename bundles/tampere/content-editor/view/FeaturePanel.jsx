import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Tooltip } from 'oskari-ui';
import { FeatureForm } from './FeatureForm';
import { Helper } from './Helper';
import { DrawingHelper } from './DrawingHelper';


export const FeaturePanel = ({ layer = {}, feature = {}, onCancel}) => {
    const type = Helper.detectGeometryType(layer.geometryType);
    const isMulti = type.includes('Multi');
    const featureProperties = feature.properties || {};
    const isNew = !featureProperties._oid;
    const [isDrawing, setDrawingMode] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(feature);
    const stopDrawing = () => {
        console.log('stopping');
        setDrawingMode(false);
        DrawingHelper.stopDrawing();
    }
    /*
    useEffect(() => {
        return () => {
            stopDrawing();
        }
    });
*/
    const isGeomBtnShown = (btnType) => !isDrawing && type.includes(btnType) && (isNew || isMulti);
    const startDrawing = (type) => {
        console.log('starting');
        DrawingHelper.startDrawing(type, isMulti, currentFeature.geometry,
            (updatedFeature) => {
                setCurrentFeature({
                    ...currentFeature,
                    geometry: updatedFeature.geometry
                });
            });
        setDrawingMode(true);
    };
    return (<React.Fragment>
        <div className="toolrow">
            <div className="content-draw-tools">
                { isDrawing && 
                    <Button onClick={() => stopDrawing()}><Message messageKey="ContentEditorView.tools.finishSketch" /></Button>
                }
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
                { !isNew && !isDrawing && <React.Fragment>
                    <Tooltip title={<Message messageKey="ContentEditorView.tools.geometryEdit" />}>
                        <Button onClick={() => startDrawing('Point')}><Message messageKey="ContentEditorView.tools.geometryEdit" /></Button>
                    </Tooltip>
                    <Tooltip title={<Message messageKey="ContentEditorView.tools.remove" />}>
                        <Button><Message messageKey="ContentEditorView.tools.remove" /></Button>
                    </Tooltip>
                </React.Fragment>}
            </div>
        </div>
        <div className="properties-container">
            <FeatureForm config={layer} feature={currentFeature} />
            <Button onClick={onCancel}><Message messageKey="ContentEditorView.buttons.cancel" /></Button>
        </div>
    </React.Fragment>);
};

FeaturePanel.propTypes = {
    layer: PropTypes.object,
    feature: PropTypes.object,
    editing: PropTypes.bool,
    onCancel: PropTypes.func
};