import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { Content, RadioGroup, Label } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { METHOD_OPTIONS } from '../../constants';

const NO_LAYERS_LABEL = 'AnalyseView.content.noLayersForMethod';

export const LayerSelect = ({ 
    layers,
    state,
    labels,
    controller
}) => {
    const { layerId, targetId, method } = state;
    const { validateLayer = [] } = METHOD_OPTIONS[method] || {};
    const filtered = layers.filter(l => l.getId() !== layerId);
    const disabledIds = filtered.filter(l => !validateLayer.every(func => func(l))).map(l => l.getId());
    return (
        <Content>
            <Label>
                <Message messageKey={labels.title} />
                <InfoIcon title={<Message messageKey={labels.tooltip} />} />
            </Label>
            <RadioGroup value={targetId} onChange={(e) => controller.setTargetLayerId(e.target.value)}>
                { filtered.map(layer => {
                    const layerId = layer.getId();
                    const disabled = disabledIds.includes(layerId);
                    return (
                        <Radio.Choice key={layerId} value={layerId} disabled={disabled}>
                            <span>{layer.getName()}</span>
                        </Radio.Choice>
                    );
                })}
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
