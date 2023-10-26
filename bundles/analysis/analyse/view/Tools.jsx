import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { Content, RadioGroup, Label } from './styled';
import { FILTER } from './constants';

const DRAW_MODES = ['point', 'line', 'area'];
const filterOptions = Object.values(FILTER);

const DrawOption = styled('div')`
    cursor: pointer;
`;

export const Tools = ({ controller, filter, features }) => {
    return (
        <Content>
            <Label>
                <Message messageKey={`AnalyseView.params.${locKey}`} />
            </Label>
            { DRAW_MODES.map(mode => (
                <Tooltip key={key} title={drawTools[key].tooltip}>
                    <DrawOption className={`add-${mode} tool`} onClick={() => controller.startDraw(mode)}/>
                </Tooltip>
            ))}
            <Label>
                <Message messageKey='AnalyseView.content.selectionTools.title' />
                <InfoIcon title={<Message messageKey='AnalyseView.content.selectionTools.description' />} />
            </Label>
            <RadioGroup value={filter}
                onChange={(e) => controller.setValue('filter', e.target.value)}>
                {filterOptions.map((opt) => (
                    <Radio.Choice key={opt}>
                        <Message messageKey={`AnalyseView.content.selectionTools.filter.${opt}`} />
                    </Radio.Choice>
                ))}
            </RadioGroup>
            <Button onClick={() => controller.removeSelections()} disabled={!features.length}>
                <Message messageKey='AnalyseView.content.selectionTools.button.empty' />
            </Button>
        </Content>
    );
};

Tools.propTypes = {
    filter: PropTypes.string.isRequired,
    features: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
