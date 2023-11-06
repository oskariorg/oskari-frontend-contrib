import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { Content, RadioGroup, Label, Space, InlineGroup } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { LayerSelect } from './LayerSelect';
import { SPATIAL_OPTIONS } from '../../constants';

const LABELS = {
    title: 'AnalyseView.spatial.intersectingLayer',
    tooltip: 'AnalyseView.spatial.intersectingLayerTooltip'
};

export const Intersect = ({ 
    state,
    layers,
    layer,
    controller
}) => {
    const name = layer?.getName() || '';
    return (
        <Content>
            <Label>
                <Message messageKey={'AnalyseView.spatial.target'} />
                <InfoIcon title={<Message messageKey={'AnalyseView.spatial.targetTooltip'} />} />
            </Label>
            <InlineGroup>
                <span>{name}</span>
            </InlineGroup>
            <LayerSelect layers={layers} state={state} controller={controller} labels={LABELS}/>
            <Space/>
            <Label>
                <Message messageKey={'AnalyseView.spatial.label'} />
                <InfoIcon title={<Message messageKey={'AnalyseView.spatial.labelTooltipIntersect'} />} />
            </Label>
            <RadioGroup value={state.methodParams.operator}
                onChange={(e) => controller.setMethodParam('operator', e.target.value)}>
                {SPATIAL_OPTIONS.map(opt => (
                    <Radio.Choice key={opt} value={opt}>
                        <Message messageKey={`AnalyseView.spatial.options.${opt}`} />
                    </Radio.Choice>
                ))}
            </RadioGroup>
        </Content>
    );
};

Intersect.propTypes = {
    state: PropTypes.object.isRequired,
    layer: PropTypes.object,
    layers: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    showSpatial: PropTypes.bool
};
