import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { FeaturePanel } from './FeaturePanel';
import { ErrorPanel } from './ErrorPanel';
import { InfoPanel } from './InfoPanel';
import styled from 'styled-components';


export const StyledPanel = styled('div')`
    background: #FFF;
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    /* sidebar has 3, we want to open it on top of this */
    z-index: 2;
    width: 382px;
    
    div.header {
        background-color: #FDF8D9;
        padding: 5px 10px;
        div.icon-close {
            float: right;
        }
    }

    div.content {
        padding: 10px;
        overflow: auto;
        height: 89%;
    }
`;

export const SidePanel = ({ layer = {}, feature = {}, editing = false, loading = false, onClose, onCancel, startNewFeature}) => {
    const hasLayer = !!layer.geometryType;
    const hasFeature = hasLayer && feature.type === 'Feature';
    const showHelpText = hasLayer && !hasFeature;
    const onSave = (updatedFeature) => {
        console.log('TODO: save:', updatedFeature);
        onCancel();
    };
    return (
        <StyledPanel className="content-editor">
            <div className="header">
                <div className="icon-close" onClick={onClose}></div>
                <h3><Message messageKey="ContentEditorView.title" /></h3>
            </div>
            <div className="content">
                { !hasLayer && <ErrorPanel loading={loading} />}
                { showHelpText && <InfoPanel layer={layer} startNewFeature={startNewFeature} />}
                { hasFeature &&
                    <FeaturePanel 
                        layer={layer}
                        onCancel={onCancel}
                        onSave={onSave}
                        feature={feature} />
                }
            </div>
        </StyledPanel>
    );
};

SidePanel.propTypes = {
    layer: PropTypes.object,
    feature: PropTypes.object,
    editing: PropTypes.bool,
    loading: PropTypes.bool,
    onClose: PropTypes.func,
    onCancel: PropTypes.func,
    startNewFeature: PropTypes.func
};