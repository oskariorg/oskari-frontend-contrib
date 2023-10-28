import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, RadioGroup, RadioButton, Label } from '../styled';
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
            <span>{name}</span>
            <LayerSelect layers={layers} state={state} controller={controller} labels={LABELS}/>
            <Label>
                <Message messageKey={'AnalyseView.spatial.label'} />
                <InfoIcon title={<Message messageKey={'AnalyseView.spatial.labelTooltipIntersect'} />} />
            </Label>
            <RadioGroup value={state.methodParams.operator}
                onChange={(e) => controller.setMethodParam('operator', e.target.value)}>
                {SPATIAL_OPTIONS.map(opt => (
                    <RadioButton key={opt} value={opt}>
                        <Message messageKey={`AnalyseView.spatial.options.${opt}`} />
                    </RadioButton>
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
