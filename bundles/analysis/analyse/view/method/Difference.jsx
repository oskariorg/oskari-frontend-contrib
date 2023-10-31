import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content, Label, InlineGroup, Space, StyledSelect } from '../styled';
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
            <Space>
                <Message messageKey='AnalyseView.content.noProperties'/>
            </Space>
        );
    }
    const options = properties.map(value => ({ value, label: labels[value] || value }));
    return (
        <StyledSelect value={value} onChange={onChange}
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
            <InlineGroup>
                <span>{layerName}</span>
            </InlineGroup>
            <Label>
                <Message messageKey='AnalyseView.difference.field' />
                <InfoIcon title={<Message messageKey='AnalyseView.difference.firstLayerFieldTooltip' />} />
            </Label>
            <PropertiesSelect
                value={property}
                properties={layerProps}
                labels={layerLabels}
                onChange={prop => controller.setMethodParam('property', prop)}/>
            <LayerSelect layers={layers} state={state} controller={controller} labels={LABELS}/>
            <Space/>
            <Label>
                <Message messageKey='AnalyseView.difference.field' />
                <InfoIcon title={<Message messageKey='AnalyseView.difference.secondLayerFieldTooltip' />} />
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
