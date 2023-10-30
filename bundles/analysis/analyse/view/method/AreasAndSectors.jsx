import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, TextInput, Select, Option } from 'oskari-ui';
import { Content, Label, InlineGroup } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { BUNDLE_KEY, LIMITS, BUFFER } from '../../constants';

const getPlaceholder = key =>
    Oskari.getMsg(BUNDLE_KEY, `AnalyseView.areas_and_sectors.${key}_tooltip`, { max: LIMITS.areas});

const bufferOpts = Object.keys(BUFFER);

export const AreasAndSectors = ({ 
    params,
    controller
}) => {
    const { unit, size, areas, sectors } = params;
    return (
        <Content>
            <Label>
                <Message messageKey='AnalyseView.areas_and_sectors.label' />
                <InfoIcon title={<Message messageKey='AnalyseView.areas_and_sectors.labelTooltip' />} />
            </Label>
            <Message messageKey='AnalyseView.areas_and_sectors.area_size' />
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
            <Message messageKey='AnalyseView.areas_and_sectors.area_count' />
            <TextInput value={ areas }
                placeholder={getPlaceholder('area_count')}
                onChange={ event => controller.setMethodParam('areas', event.target.value) } />
            <Message messageKey='AnalyseView.areas_and_sectors.sector_count' />
            <TextInput value={ sectors }
                placeholder={getPlaceholder('sector_count')}
                onChange={ event => controller.setMethodParam('sectors', event.target.value) } />
        </Content>
    );
};

AreasAndSectors.propTypes = {
    params: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
