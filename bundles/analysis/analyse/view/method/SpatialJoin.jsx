import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Select } from 'oskari-ui';
import { Content, RadioGroup, RadioButton, Label } from '../styled';
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
    return (
        <Fragment>
            <Label>
                <Message messageKey='AnalyseView.params.label' />
                <InfoIcon title={<Message messageKey={tooltip}/>} />
            </Label>
            <Select mode='multiple' value={values}
                onChange={onChange} options={options}/>
            { !properties.length && <Message messageKey='AnalyseView.content.noProperties'/> }
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
                    <RadioButton key={mode} value={mode}>
                        <Message messageKey={`AnalyseView.spatial_join.${mode}Mode`}/>
                    </RadioButton>
                ))}
            </RadioGroup>
            <Label>
                <Message messageKey='AnalyseView.difference.firstLayer' />
                <InfoIcon title={<Message messageKey='AnalyseView.difference.firstLayerTooltip' />} />
            </Label>
            <span>{layer?.getName() || ''}</span>
            <PropertiesSelect
                values={properties}
                properties={getProperties(layer)}
                labels={layer?.getPropertyLabels()}
                tooltip='AnalyseView.spatial_join.firstLayerFieldTooltip'
                onChange={values => controller.setMethodParam('properties', values)}/>
            <LayerSelect layers={layers} state={state} controller={controller} labels={LABELS}/>
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
