import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, TextInput, Select, Option } from 'oskari-ui';
import { Content, InlineGroup, Label } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { BUFFER } from '../../constants';

const bufferOpts = Object.keys(BUFFER);

export const Buffer = ({ 
    params,
    controller
}) => {
    const { unit, size } = params;
    return (
        <Content>
            <Label>
                <Message messageKey='AnalyseView.buffer_size.label' />
                <InfoIcon title={<Message messageKey='AnalyseView.buffer_size.labelTooltip' />} />
            </Label>
            <InlineGroup>
                <TextInput value={ size }
                    onChange={ event => controller.setMethodParam('size', event.target.value) } />
                <Select value={unit}
                    onChange={val => controller.setMethodParam('unit', val)} >
                    {bufferOpts.map(opt => (
                        <Option value={opt} key={opt}>{opt}</Option>
                    ))}
                </Select>
            </InlineGroup>
        </Content>
    );
};

Buffer.propTypes = {
    params: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
