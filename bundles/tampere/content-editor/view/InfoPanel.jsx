import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Tooltip, Spin } from 'oskari-ui';
import styled from 'styled-components';

// <Button disabled={true}><Message messageKey="ContentEditorView.buttons.editMultipleFeatures" /></Button>

export const StyledMessage = styled('div')`
    margin-bottom: 20px;
`;

export const InfoPanel = ({ layer = {}, startNewFeature}) => {
    return (<React.Fragment>
        <StyledMessage><Message messageKey="ContentEditorView.featureModifyInfo" /></StyledMessage>
        <StyledMessage><Message messageKey="ContentEditorView.multipleFeatureModifyInfo" /></StyledMessage>
        <StyledMessage><Message messageKey="ContentEditorView.toolInfo" /></StyledMessage>
        <StyledMessage><Message messageKey="ContentEditorView.geometryModifyInfo" /></StyledMessage>
        <StyledMessage><Message messageKey="ContentEditorView.geometryDeleteInfo" /></StyledMessage>
        <StyledMessage>
            <Button onClick={startNewFeature}><Message messageKey="ContentEditorView.buttons.addFeature" /></Button>
        </StyledMessage>
    </React.Fragment>);
};

InfoPanel.propTypes = {
    layer: PropTypes.object,
    startNewFeature: PropTypes.func
};