import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, Label } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { LayerSelect } from './LayerSelect';

const LABELS = {
    title: 'AnalyseView.intersect.label' ,
    tooltip: 'AnalyseView.intersect.labelTooltip' 
};

export const Clip = ({ 
    state,
    layers,
    layer,
    controller,
}) => {
    
    const name = layer?.getName() || '';
    return (
        <Content>
            <Label>
                <Message messageKey='AnalyseView.intersect.target' />
                <InfoIcon title={<Message messageKey='AnalyseView.intersect.targetLabelTooltip'/>} />
            </Label>
            <span>{name}</span>
            <LayerSelect layers={layers} state={state} controller={controller} labels={LABELS}/>
        </Content>
    );
};

Clip.propTypes = {
    state: PropTypes.object.isRequired,
    layer: PropTypes.object,
    layers: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
