import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, TextInput, Select, Option } from 'oskari-ui';
import { Content, Label, InlineGroup, Group } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { BUNDLE_KEY, LIMITS, BUFFER } from '../../constants';

const getPlaceholder = key =>
    Oskari.getMsg(BUNDLE_KEY, `AnalyseView.areas_and_sectors.${key}_tooltip`, { max: LIMITS.areas});

const bufferOpts = Object.keys(BUFFER);

export const AreasAndSectors = ({ 
    params,
    controller
}) => {
    const { unit, size, areaCount, sectorCount } = params;
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
            <Group>
                <Message messageKey='AnalyseView.areas_and_sectors.area_count' />
                <TextInput value={ areaCount }
                    placeholder={getPlaceholder('area_count')}
                    onChange={ event => controller.setMethodParam('areaCount', event.target.value) } />
            </Group>
            <Group>
                <Message messageKey='AnalyseView.areas_and_sectors.sector_count' />
                <TextInput value={ sectorCount }
                    placeholder={getPlaceholder('sector_count')}
                    onChange={ event => controller.setMethodParam('sectorCount', event.target.value) } />
            </Group>
        </Content>
    );
};

AreasAndSectors.propTypes = {
    params: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
