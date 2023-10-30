import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, RadioGroup, RadioButton } from './styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { METHODS, METHOD_OPTIONS } from '../constants';
import { getProperties } from '../service/AnalyseHelper';

// Radio.Choice
const MethodContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;

export const Methods = ({ controller, state, layersCount, layer }) => {
    const disabledMethods = METHODS.filter(method => {
        const { minLayers = 0, validateLayer = [] } = METHOD_OPTIONS[method] || {};
        if (layersCount < minLayers) {
            return false;
        }
        return !validateLayer.every(func => func(layer));
    });

    return (
        <Content>
            <RadioGroup value={state.method}
                onChange={(e) => controller.setMethod(e.target.value)}>
                {METHODS.map(method => {
                    const disabled = disabledMethods.includes(method)
                    return (
                        <RadioButton key={method} value={method} disabled={disabled}>
                            <Message messageKey={`AnalyseView.method.options.${method}.label`}/>
                            { disabled && <InfoIcon style={{color: '#FF0000'}} title={<Message messageKey='TODO'/>} />}
                            <InfoIcon title={<Message messageKey={`AnalyseView.method.options.${method}.tooltip`}/>} />
                        </RadioButton>
                    );
                })}
            </RadioGroup>
        </Content>
    );
};

Methods.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
