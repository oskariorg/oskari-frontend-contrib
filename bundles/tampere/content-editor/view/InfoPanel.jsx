import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Tooltip, Spin } from 'oskari-ui';

// <Button disabled={true}><Message messageKey="ContentEditorView.buttons.editMultipleFeatures" /></Button>

export const InfoPanel = ({ layer = {}, startNewFeature}) => {
    return (<div className="content">
        <div><Message messageKey="ContentEditorView.featureModifyInfo" /></div>
        <div><Message messageKey="ContentEditorView.multipleFeatureModifyInfo" /></div>
        <div><Message messageKey="ContentEditorView.toolInfo" /></div>
        <div><Message messageKey="ContentEditorView.geometryModifyInfo" /></div>
        <div><Message messageKey="ContentEditorView.geometryDeleteInfo" /></div>
        <div>
            <Button onClick={startNewFeature}><Message messageKey="ContentEditorView.buttons.addFeature" /></Button>
        </div>
    </div>);
};

InfoPanel.propTypes = {
    layer: PropTypes.object,
    startNewFeature: PropTypes.func
};