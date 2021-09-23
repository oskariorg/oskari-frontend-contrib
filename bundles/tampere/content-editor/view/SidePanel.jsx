import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';

export const SidePanel = (props) => {
    return (
        <div className="content-editor">
            <div className="header">
                <div className="icon-close" onClick={props.onClose}></div>
                <h3><Message messageKey="ContentEditorView.title" /></h3>
            </div>
            <div className="content">
                <div><Message messageKey="ContentEditorView.featureModifyInfo" /></div>
                <div><Message messageKey="ContentEditorView.multipleFeatureModifyInfo" /></div>
                <div><Message messageKey="ContentEditorView.toolInfo" /></div>
                <div><Message messageKey="ContentEditorView.geometryModifyInfo" /></div>
                <div><Message messageKey="ContentEditorView.geometryDeleteInfo" /></div>
            </div>
        </div>
    );
};

SidePanel.propTypes = {
    isValid: PropTypes.bool,
    onClose: PropTypes.func
};