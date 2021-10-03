import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { FeaturePanel } from './FeaturePanel';
import { ErrorPanel } from './ErrorPanel';
import { InfoPanel } from './InfoPanel';



export const SidePanel = ({ layer = {}, feature = {}, editing = false, loading = false, onClose, onCancel, startNewFeature}) => {
    const hasLayer = !!layer.geometryType;
    const hasFeature = hasLayer && feature.type === 'Feature';
    const showHelpText = hasLayer && !hasFeature;
    return (
        <div className="content-editor">
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
                        feature={feature} />
                }
            </div>
        </div>
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