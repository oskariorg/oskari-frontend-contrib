import React from 'react';
import PropTypes from 'prop-types';
import { Message, Button, Space } from 'oskari-ui';
import { Card } from 'oskari-ui/components/Card';
import styled from 'styled-components';

const Paragraph = styled('p')``;
export const InfoPanel = ({ layer = {}, startNewFeature, onClose}) => {
    return (
        <React.Fragment>
            <Message messageKey="ContentEditorView.info.layerLabel" />:
            <Space direction="vertical">
                <Card title={layer.name}>
                    <Message messageKey="ContentEditorView.info.featureModifyInfo" LabelComponent={Paragraph}/>
                </Card>
                
                <Space>
                    <Button onClick={onClose}>
                        <Message messageKey="ContentEditorView.buttons.cancel" />
                    </Button>
                    <Button onClick={startNewFeature}  type="primary">
                        <Message messageKey="ContentEditorView.buttons.addFeature" />
                    </Button>
                </Space>
            </Space>
        </React.Fragment>);
};

InfoPanel.propTypes = {
    layer: PropTypes.object,
    startNewFeature: PropTypes.func,
    onClose: PropTypes.func
};
