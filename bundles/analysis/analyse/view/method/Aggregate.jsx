import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, Label, InlineGroup, StyledSwitch } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { AGGREGATE_OPTIONS } from '../../constants';

export const Aggregate = ({ 
    controller,
    params,
    layer
}) => {
    const { operators } = params;
    const onPropertyChange = (isAdd, operator) => {
        const updated = isAdd ? [...operators, operator] : operators.filter(op => op !== operator);
        controller.setMethodParam('operators', updated);
    };
    const { noDataValue } = layer?.getWpsLayerParams() || {};
    return (
        <Content>
            <Label>
                <Message messageKey='AnalyseView.aggregate.label' />
                <InfoIcon title={<Message messageKey='AnalyseView.aggregate.labelTooltip' />} />
            </Label>
            {AGGREGATE_OPTIONS.map((opt) => (
                <InlineGroup key={opt}>
                    <StyledSwitch size='small'
                        disabled={ opt === 'NoDataCnt' && !noDataValue }
                        checked={operators.includes(opt)}
                        onChange={checked => onPropertyChange(checked, opt)}/>
                    <Message messageKey={`AnalyseView.aggregate.options.${opt}`} />
                </InlineGroup>
            ))}
        </Content>
    );
};

Aggregate.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    params: PropTypes.object.isRequired,
    layer: PropTypes.object
};
