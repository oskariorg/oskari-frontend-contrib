import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, Label } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { AGGREGATE_OPTIONS } from '../../constants';

export const Aggregate = ({ 
    controller,
    params
}) => {
    const { functions } = params;
    const onPropertyChange = (isAdd, func) => {
        const functions = isAdd ? [...selected, func] : selected.filter(p => p !== func);
        controller.setMethodParams('selected', functions);
    };
    return (
        <Content>
            <Label>
                <Message messageKey='AnalyseView.aggregate.label' />
                <InfoIcon title={<Message messageKey='AnalyseView.aggregate.labelTooltip' />} />
            </Label>
            {AGGREGATE_OPTIONS.map((opt) => (
                <Switch ize='small' checked={functions.includes(opt)} onChange={checked => onPropertyChange(checked, opt)}>
                    <Message messageKey={`AnalyseView.aggregate.options.${opt}`} />
                </Switch>
            ))}
        </Content>
    );
};

Aggregate.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired,
    params: PropTypes.object.isRequired
};
