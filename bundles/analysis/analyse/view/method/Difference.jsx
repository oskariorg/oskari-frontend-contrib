import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Select } from 'oskari-ui';
import { Content, Label } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { LayerSelect } from './LayerSelect';
import { getProperties } from '../../service/AnalyseHelper';

const LABELS = {
    title: 'AnalyseView.difference.secondLayer',
    tooltip: 'AnalyseView.difference.secondLayerTooltip'
};

const PropertiesSelect = ({ properties, labels = {}, value, onChange }) => {
    if (!properties.length) {
        return (
            <Message messageKey='AnalyseView.content.noProperties'/>
        );
    }
    const options = properties.map(value => ({ value, label: labels[value] || value }));
    return (
        <Select value={value} onChange={onChange}
            options={options} />
    );
};

export const Difference = ({ 
    state,
    layer,
    layers,
    controller
}) => {
    const { targetId, methodParams: { property, targetProperty, joinKey }} = state;
    const targetLayer = layers.find(l => l.getId() === targetId);

    const layerName = layer?.getName() || '';
    const layerProps = getProperties(layer);
    const layerLabels = layer?.getPropertyLabels();
    const commonId = targetLayer?.getWpsLayerParams().commonId;
    const layerJoinProps = typeof commonId !== 'undefined'
        && targetLayer?.getWpsLayerParams().commonId === commonId
        ? [commonId] : layerProps;

    return (
        <Content>
            <Label>
                <Message messageKey='AnalyseView.difference.firstLayer' />
                <InfoIcon title={<Message messageKey='AnalyseView.difference.firstLayerTooltip' />} />
            </Label>
            <span>{layerName}</span>
            <PropertiesSelect
                value={property}
                properties={layerProps}
                labels={layerLabels}
                onChange={prop => controller.setMethodParam('property', prop)}/>
            <LayerSelect layers={layers} state={state} controller={controller} labels={LABELS}/>
            <Label>
                <Message messageKey='AnalyseView.difference.firstLayer' />
                <InfoIcon title={<Message messageKey='AnalyseView.difference.firstLayerTooltip' />} />
            </Label>
            <PropertiesSelect
                value={targetProperty}
                properties={getProperties(targetLayer)}
                labels={targetLayer?.getPropertyLabels()}
                onChange={prop => controller.setMethodParam('targetProperty', prop)}/>
            <Label>
                <Message messageKey='AnalyseView.difference.keyField' />
                <InfoIcon title={<Message messageKey='AnalyseView.difference.keyFieldTooltip' />} />
            </Label>
            <PropertiesSelect
                value={joinKey}
                properties={layerJoinProps}
                labels={layerLabels}
                onChange={prop => controller.setMethodParam('joinKey', prop)}/>
        </Content>
    );
};

Difference.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layers: PropTypes.array.isRequired,
    layer: PropTypes.object
};
