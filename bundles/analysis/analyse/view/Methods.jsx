import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, RadioGroup, RadioButton } from './styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { METHODS } from '../constants';

// Radio.Choice
const MethodContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;

export const Methods = ({ controller, state }) => {
    const disabled = state.isTemp ? ['', ''] : [];
    return (
        <Content>
            <RadioGroup value={state.method}
                onChange={(e) => controller.setValue('method', e.target.value)}>
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

Methods.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
