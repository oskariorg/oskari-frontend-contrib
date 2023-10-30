import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { TextInput, Switch, Message } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Content, Label, InlineGroup } from './styled';
import { MethodParams } from './method/MethodParams';
import { PropertySelection } from './PropertySelection';
import { METHOD_OPTIONS } from '../constants';

export const Params = ({ controller, state, layers, layer }) => {
    const { allowNoSave = false } = METHOD_OPTIONS[state.method] || {};
    return (
        <Content>
            <MethodParams
                layer={layer}
                controller={controller}
                state={state}
                layers={layers}/>
            <PropertySelection controller={controller} state={state} layer={layer}/>
            <Label>
                <Message messageKey='AnalyseView.analyse_name.label' />
                <InfoIcon title={<Message messageKey='AnalyseView.analyse_name.labelTooltip' />} />
            </Label>
            <TextInput type='text' value={state.name}
                onChange={(e) => controller.setValue('name', e.target.value)} />
            <InlineGroup>
                <Switch size='small' checked={state.showFeatureData}
                    disabled={state.showDataWithoutSaving}
                    onChange={checked => controller.setValue('showFeatureData', checked)}/>
                <Message messageKey='AnalyseView.showFeatureData' />
            </InlineGroup>
            { allowNoSave && (
                <InlineGroup>
                    <Switch size='small'
                        checked={state.showDataWithoutSaving}
                        onChange={controller.setShowDataWithoutSaving}/>
                    <Message messageKey='AnalyseView.showValuesCheckbox' />
                </InlineGroup>
            )}
        </Content>
    );
};

Params.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layers: PropTypes.array.isRequired,
    layer: PropTypes.object
};
