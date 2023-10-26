import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { Content, RadioGroup } from './styled';
import { InfoIcon } from 'oskari-ui/components/icons';

const METHODS = [
    'buffer',
    'aggregate',
    'union',
    'clip',
    'intersect',
    'layer_union',
    'areas_and_sectors',
    'difference',
    'spatial_join'
];

// Radio.Choice
const MethodContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;

export const Union = ({ 
    state,
    controller,
    analysisLayer,
    layers
}) => {
    const targetLayer = layers.find(l => l.getId() === state.targetLayerId);
    if ()
    return (
        <Content>
            <RadioGroup value={state.method}
                onChange={(e) => controller.setMethod(e.target.value)}>
                {METHODS.map((method) => (
                    <Radio.Choice key={method} disabled={disabled.includes(method)}>
                        <Message messageKey={`AnalyseView.method.options.${method}.label`}/>
                        <InfoIcon title={<Message messageKey={`AnalyseView.method.options.${value}.tooltip`}/>} />
                    </Radio.Choice>
                ))}
            </RadioGroup>
        </Content>
    );
};

Union.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    analysisLayer: PropTypes.object,
    layers: PropTypes.array.isRequired
};
