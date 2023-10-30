import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, RadioButton, RadioGroup, Label } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';

const NO_LAYERS_LABEL = 'AnalysisView.content.noLayersForMethod';

export const LayerSelect = ({ 
    layers,
    state,
    labels,
    controller
}) => {
    const { layerId, targetId } = state;
    const filtered = layers.filter(l => l.getId() !== layerId);
    return (
        <Content>
            <Label>
                <Message messageKey={labels.title} />
                <InfoIcon title={<Message messageKey={labels.tooltip} />} />
            </Label>
            <RadioGroup value={targetId} onChange={(e) => controller.setTargetLayerId(e.target.value)}>
                { filtered.map(layer => (
                    <RadioButton key={layer.getId()} value={layer.getId()}>
                        <span>{layer.getName()}</span>
                    </RadioButton>
                ))}
            </RadioGroup>
            {!filtered.length && <Message messageKey={labels.noLayers || NO_LAYERS_LABEL}/>}
        </Content>
    );
};

LayerSelect.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    labels: PropTypes.object.isRequired,
    layers: PropTypes.array.isRequired
};
