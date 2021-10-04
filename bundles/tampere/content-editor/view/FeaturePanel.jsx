import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Message, Button } from 'oskari-ui';
import { FeatureForm } from './FeatureForm';
import { GeometryPanel } from './GeometryPanel';

import { Helper } from './Helper';
import { DrawingHelper } from './DrawingHelper';


export const FeaturePanel = ({ layer = {}, feature = {}, onCancel, onSave}) => {
    const type = Helper.detectGeometryType(layer.geometryType);
    const isMulti = type.includes('Multi');
    const featureProperties = feature.properties || {};
    const isNew = !featureProperties._oid;
    const [isDrawing, setDrawingMode] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(feature);
    const stopDrawing = () => {
        setDrawingMode(false);
        DrawingHelper.stopDrawing();
    };
    const cancelCb = () => {
        stopDrawing();
        onCancel();
    };
    const saveCb = () => {
        stopDrawing();
        onSave(currentFeature);
    };
    const onPropsChange = (updated) => {
        setCurrentFeature({
            ...currentFeature,
            properties: updated.properties
        });
    }
    useEffect(() => {
        // workaround for state issue when changing target feature
        if (currentFeature.id !== feature.id) {
            setCurrentFeature(feature);
        }
    });
    const updateGeometry = (updatedFeature) => {
        setCurrentFeature({
            ...currentFeature,
            geometry: updatedFeature.geometry
        });
    };
    const startDrawing = (type) => {
        DrawingHelper.startDrawing(type, isMulti, currentFeature.geometry, updateGeometry);
        setDrawingMode(true);
    };
    return (<React.Fragment>
        <div>
            Kohteen tiedot:
            { isNew && <span>Uusi kohde</span>}
            { !isNew && <span>FID: {currentFeature.id}</span>}
        </div>
        <div className="properties-container">
            <FeatureForm config={layer} feature={currentFeature} onChange={onPropsChange} />
            
            { isDrawing && 
                <Button onClick={() => stopDrawing()}><Message messageKey="ContentEditorView.tools.finishSketch" /></Button>
            }
            { !isDrawing &&
                <GeometryPanel
                    type={layer.geometryType}
                    feature={currentFeature}
                    startDrawing={startDrawing}
                    updateGeometry={updateGeometry} />
            }
            <hr />
            <Button onClick={cancelCb}><Message messageKey="ContentEditorView.buttons.cancel" /></Button>
            <Button onClick={saveCb}><Message messageKey="ContentEditorView.buttons.save" /></Button>
        </div>
    </React.Fragment>);
};

FeaturePanel.propTypes = {
    layer: PropTypes.object,
    feature: PropTypes.object,
    editing: PropTypes.bool,
    onCancel: PropTypes.func,
    onSave: PropTypes.func
};