import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Tooltip, Spin } from 'oskari-ui';



export const SidePanel = ({ layer = {}, editing = false, loading = false, onClose, startNewFeature}) => {
    let panelContent = (<div className="content">
        <div><Message messageKey="ContentEditorView.featureModifyInfo" /></div>
        <div><Message messageKey="ContentEditorView.multipleFeatureModifyInfo" /></div>
        <div><Message messageKey="ContentEditorView.toolInfo" /></div>
        <div><Message messageKey="ContentEditorView.geometryModifyInfo" /></div>
        <div><Message messageKey="ContentEditorView.geometryDeleteInfo" /></div>
        <div>
            <Button disabled={true}><Message messageKey="ContentEditorView.buttons.editMultipleFeatures" /></Button>
            <Button disabled={editing} onClick={startNewFeature}><Message messageKey="ContentEditorView.buttons.addFeature" /></Button>
        </div>
        
        <div className="toolrow">
            <div className="content-draw-tools">
                <Tooltip title={<Message messageKey="ContentEditorView.tools.point" />}>
                    <div className="add-point tool"></div>
                </Tooltip>
                <Tooltip title={<Message messageKey="ContentEditorView.tools.line" />}>
                    <div className="add-line tool"></div>
                </Tooltip>
                <Tooltip title={<Message messageKey="ContentEditorView.tools.area" />}>
                    <div className="add-area tool"></div>
                </Tooltip>
                
                <Tooltip title={<Message messageKey="ContentEditorView.tools.geometryEdit" />}>
                    <div className="selection-area tool"></div>
                </Tooltip>
                <Tooltip title={<Message messageKey="ContentEditorView.tools.remove" />}>
                    <div className="selection-remove tool"></div>
                </Tooltip>
                <p>
                TODO: draw tools (_addDrawTools())
                </p>
            </div>
        </div>
        <div className="properties-container">
            { !layer.geometryType && <p>Tason tiedot puuttuvat</p>}
        </div>
    </div>);
    if (loading) {
        panelContent = <Spin>{panelContent}</Spin>;
    }
    return (
        <div className="content-editor">
            <div className="header">
                <div className="icon-close" onClick={onClose}></div>
                <h3><Message messageKey="ContentEditorView.title" /></h3>
            </div>
            {panelContent}
        </div>
    );
};

SidePanel.propTypes = {
    layer: PropTypes.object,
    editing: PropTypes.bool,
    loading: PropTypes.bool,
    onClose: PropTypes.func,
    startNewFeature: PropTypes.func
};