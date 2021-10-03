import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Tooltip, Spin } from 'oskari-ui';
import { FeatureForm } from './FeatureForm';
import { Helper } from './Helper';


export const FeaturePanel = ({ layer = {}, feature = {}, onCancel}) => {
    const type = Helper.detectGeometryType(layer.geometryType);
    const isMulti = type.includes('Multi');
    const featureProperties = feature.properties || {};
    const isNew = !featureProperties._oid;

    const isGeomBtnShown = (btnType) => type.includes(btnType) && (isNew || isMulti);
    
    return (<div className="content">
        <div className="toolrow">
            <div className="content-draw-tools">
                { isGeomBtnShown('Point') &&
                    <Tooltip title={<Message messageKey="ContentEditorView.tools.point" />}>
                        <div className="add-point tool"></div>
                    </Tooltip>
                }
                { isGeomBtnShown('LineString') &&
                    <Tooltip title={<Message messageKey="ContentEditorView.tools.line" />}>
                        <div className="add-line tool"></div>
                    </Tooltip>
                }
                { isGeomBtnShown('Polygon') &&
                    <Tooltip title={<Message messageKey="ContentEditorView.tools.area" />}>
                        <div className="add-area tool"></div>
                    </Tooltip>
                }
                { !isNew && <React.Fragment>
                    <Tooltip title={<Message messageKey="ContentEditorView.tools.geometryEdit" />}>
                        <Button><Message messageKey="ContentEditorView.tools.geometryEdit" /></Button>
                    </Tooltip>
                    <Tooltip title={<Message messageKey="ContentEditorView.tools.remove" />}>
                        <Button><Message messageKey="ContentEditorView.tools.remove" /></Button>
                    </Tooltip>
                </React.Fragment>}
            </div>
        </div>
        <div className="properties-container">
            <FeatureForm config={layer} feature={feature}/>
            <Button onClick={onCancel}><Message messageKey="ContentEditorView.buttons.cancel" /></Button>
        </div>
    </div>);
};

FeaturePanel.propTypes = {
    layer: PropTypes.object,
    feature: PropTypes.object,
    editing: PropTypes.bool,
    onCancel: PropTypes.func
};