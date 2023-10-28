import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, Label, InlineGroup, StyledSwitch } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { AGGREGATE_OPTIONS } from '../../constants';

export const Aggregate = ({ 
    controller,
    params
}) => {
    const { functions } = params;
    const onPropertyChange = (isAdd, func) => {
        const updated = isAdd ? [...functions, func] : functions.filter(p => p !== func);
        controller.setMethodParam('functions', updated);
    };
    return (
        <Content>
            <Label>
                <Message messageKey='AnalyseView.aggregate.label' />
                <InfoIcon title={<Message messageKey='AnalyseView.aggregate.labelTooltip' />} />
            </Label>
            {AGGREGATE_OPTIONS.map((opt) => (
                <InlineGroup key={opt}>
                    <StyledSwitch size='small' checked={functions.includes(opt)} onChange={checked => onPropertyChange(checked, opt)}/>
                    <Message messageKey={`AnalyseView.aggregate.options.${opt}`} />
                </InlineGroup>
            ))}
        </Content>
    );
};

Aggregate.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    params: PropTypes.object.isRequired
};
