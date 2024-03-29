import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message, Radio, Tooltip, Button } from 'oskari-ui';
import { Content, RadioGroup, Label, InlineGroup, Space } from './styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { FILTER } from '../constants';

const DRAW_MODES = ['point', 'line', 'area'];
const filterOptions = Object.values(FILTER);

const DrawOption = styled('div')`
    cursor: pointer;
    margin-right: 10px;
`;

export const Tools = ({ controller, filter, featureIds }) => {
    return (
        <Content>
            <Label>
                <Message messageKey='AnalyseView.content.features.title' />
            </Label>
            <InlineGroup>
                { DRAW_MODES.map(mode => (
                    <Tooltip key={mode} title={<Message messageKey={`AnalyseView.content.features.tooltips.${mode}`} />}>
                        <DrawOption className={`add-${mode} tool`} onClick={() => controller.showDrawHelpper(mode)}/>
                    </Tooltip>
                ))}
            </InlineGroup>
            <Label>
                <Message messageKey='AnalyseView.content.selectionTools.title' />
                <InfoIcon title={<Message messageKey='AnalyseView.content.selectionTools.description' />} />
            </Label>
            <RadioGroup value={filter}
                onChange={(e) => controller.setValue('filter', e.target.value)}>
                {filterOptions.map((opt) => (
                    <Radio.Choice key={opt} value={opt}>
                        <Message messageKey={`AnalyseView.content.selectionTools.filter.${opt}`} />
                    </Radio.Choice>
                ))}
            </RadioGroup>
            <Space/>
            <Button type='primary' onClick={() => controller.removeSelections()} disabled={!featureIds.length}>
                <Message messageKey='AnalyseView.content.selectionTools.button.empty' />
            </Button>
        </Content>
    );
};

Tools.propTypes = {
    filter: PropTypes.string.isRequired,
    featureIds: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
