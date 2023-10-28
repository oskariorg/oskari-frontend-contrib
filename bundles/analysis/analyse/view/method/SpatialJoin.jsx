import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, RadioGroup, RadioButton, Label } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { SPATIAL_JOIN_MODES } from '../../constants';

export const SpatialJoin = ({ 
    params,
    layers
}) => {
    const targetLayer = layers.find(l => l.getId() === state.targetLayerId);
    return (
        <Content>
            <Label>
                <Message messageKey={`AnalyseView.params.${locKey}`} />
                <InfoIcon title={<Message messageKey={`AnalyseView.params.${locKey}Tooltip`} />} />
            </Label>
            <RadioGroup value={state.method}
                onChange={(e) => controller.setMethod(e.target.value)}>
                {METHODS.map(method => (
                    <RadioButton key={method} value={method} disabled={disabled.includes(method)}>
                        <Message messageKey={`AnalyseView.method.options.${method}.label`}/>
                        <InfoIcon title={<Message messageKey={`AnalyseView.method.options.${method}.tooltip`}/>} />
                    </RadioButton>
                ))}
            </RadioGroup>
        </Content>
    );
};

SpatialJoin.propTypes = {
    params: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
