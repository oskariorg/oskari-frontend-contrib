import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { Content, RadioGroup, Label, InlineGroup, StyledSelect, Space } from '../styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { LayerSelect } from './LayerSelect';
import { SPATIAL_JOIN_MODES, LIMITS } from '../../constants';
import { getProperties } from '../../service/AnalyseHelper';

const LABELS = {
    title: 'AnalyseView.spatial_join.secondLayer',
    tooltip: 'AnalyseView.spatial_join.secondLayerTooltip'
};

const PropertiesSelect = ({ properties, labels = {}, values, onChange, tooltip }) => {
    const maxSelected = values.length >= LIMITS.properties;
    const isDisabled = value => maxSelected && !values.includes(value);
    const options = properties.map(value => ({ value, label: labels[value] || value, disabled: isDisabled(value) }));
    const hasProps = properties.length > 0;
    return (
        <Fragment>
            <Label>
                <Message messageKey='AnalyseView.params.label' />
                <InfoIcon title={<Message messageKey={tooltip}/>} />
            </Label>
            { hasProps && <StyledSelect mode='multiple' value={values}
                onChange={onChange} options={options}/> }
            { !hasProps && <Message messageKey='AnalyseView.content.noProperties'/> }
        </Fragment>
    );
};

export const SpatialJoin = ({ 
    state,
    layer,
    layers,
    controller
}) => {
    const { targetId, methodParams: { mode, properties, targetProperties }} = state;
    const targetLayer = layers.find(l => l.getId() === targetId);
    return (
        <Content>
            <Label>
                <Message messageKey='AnalyseView.spatial_join.mode' />
                <InfoIcon title={<Message messageKey='AnalyseView.spatial_join.modeTooltip'/>} />
            </Label>
            <RadioGroup value={mode}
                onChange={(e) => controller.setMethodParam('mode', e.target.value)}>
                {SPATIAL_JOIN_MODES.map(mode => (
                    <Radio.Choice key={mode} value={mode}>
                        <Message messageKey={`AnalyseView.spatial_join.${mode}Mode`}/>
                    </Radio.Choice>
                ))}
            </RadioGroup>
            <Space/>
            <Label>
                <Message messageKey='AnalyseView.spatial_join.firstLayer' />
                <InfoIcon title={<Message messageKey='AnalyseView.spatial_join.firstLayerTooltip' />} />
            </Label>
            <InlineGroup>
                <span>{layer?.getName() || ''}</span>
            </InlineGroup>
            <PropertiesSelect
                values={properties}
                properties={getProperties(layer)}
                labels={layer?.getPropertyLabels()}
                tooltip='AnalyseView.spatial_join.firstLayerFieldTooltip'
                onChange={values => controller.setMethodParam('properties', values)}/>
            <LayerSelect layers={layers} state={state} controller={controller} labels={LABELS}/>
            <Space/>
            <PropertiesSelect
                values={targetProperties}
                properties={getProperties(targetLayer)}
                labels={targetLayer?.getPropertyLabels()}
                tooltip='AnalyseView.spatial_join.secondLayerFieldTooltip'
                onChange={values => controller.setMethodParam('targetProperties', values)}/>
        </Content>
    );
};

SpatialJoin.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
