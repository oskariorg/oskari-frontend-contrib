import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { TextInput, Switch, Message, Radio, Select, Option } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Content, RadioGroup, Label } from './styled';
import { PROPERTIES, LIMITS } from './constants';

const SKIP_SELECTION = ['difference', 'spatial_join'];
const propOptions = Object.values(PROPERTIES);


const PropertySelection = ({ controller, state, layer }) => {
    const { method, properties: { type, selected }} = state;
    if (SKIP_SELECTION.includes(method)) {
        return null;
    }
    const properties = analysisLayer?.getPropertyTypes() || [];
    const labels = analysisLayer?.getPropertyTypes() || {};

    const onPropertyChange = (isAdd, prop) => {
        const selected = isAdd ? [...selected, prop] : selected.filter(p => p !== prop);
        controller.setProperties('selected', selected);
    };
    const isDisabled = type => {
        if (properties.length === 0 && type !== PROPERTIES.NONE) {
            return true;
        }
        if (type === PROPERTIES.ALL) {
            return properties.length <= LIMITS.properties;
        }
        return false;
    };
    const locKey = method === 'aggregate' ? 'aggreLabel' : 'label';
    const hasMaxSelected =  selected.length >=  LIMITS.properties;
    return (
        <Fragment>
            <Label>
                <Message messageKey={`AnalyseView.params.${locKey}`} />
                <InfoIcon title={<Message messageKey={`AnalyseView.params.${locKey}Tooltip`} />} />
            </Label>
            <Select value={type}
                onChange={(val) => controller.setProperties('type', val)} >
                {propOptions.map(opt => (
                    <Option value={opt} key={opt} disabled={isDisabled(opt)}>
                        <Message messageKey={`AnalyseView.params.options.${opt}`} />
                    </Option>
                ))}
            </Select>
            { type === PROPERTIES.SELECT && properties.map(prop => {
                const checked = selected.includes(prop);
                const name = labels[prop] || prop;
                return (
                    <Label>
                        <Switch size='small' checked={checked}
                            disabled={hasMaxSelected && !checked}
                            onChange={checked => onPropertyChange(checked, prop)} />
                        <span>{name}</span>
                    </Label>
                )})
            }
        </Fragment>
    );
};

export const Layers = ({ controller, state, layers }) => {
    const analysisLayer = layers.find(l => l.getId() === state.layerId);
        
    return (
        <Content>
            <MethodParams
                analysisLayer={analysisLayer}
                controller={controller}
                state={state}
                layers={layers}/>
            <PropertySelection controller={controller} state={state} layer={analysisLayer}/>
            <Label>
                <Message messageKey='AnalyseView.analyse_name.label' />
                <InfoIcon title={<Message messageKey='AnalyseView.analyse_name.labelTooltip' />} />
            </Label>
            <TextInput type='text' value={state.name}
                onChange={(e) => controller.setName(e.target.value)} />
            <Switch size='small' checked={state.showFeatureData}
                disabled={state.showDataWithoutSaving}
                onChange={checked => setValue('showFeatureData', checked)}>
                <Message messageKey='AnalyseView.showFeatureData' />
            </Switch>
            { state.showDataWithoutSaving && (
                <Switch size='small'
                    checked={state.showDataWithoutSaving}
                    onChange={checked => setValue('showDataWithoutSaving', checked)}>
                    <Message messageKey='AnalyseView.showFeatureData' />
                </Switch>
            )}
        </Content>
    );
};

Layers.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
