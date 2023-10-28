import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { TextInput, Switch, Message } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Content, Label, InlineGroup } from './styled';
import { MethodParams } from './method/MethodParams';
import { PropertySelection } from './PropertySelection';

export const Params = ({ controller, state, layers }) => {
    const layer = layers.find(l => l.getId() === state.layerId);
        
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
                onChange={(e) => controller.setName(e.target.value)} />
            <InlineGroup>
                <Switch size='small' checked={state.showFeatureData}
                    disabled={state.showDataWithoutSaving}
                    onChange={checked => setValue('showFeatureData', checked)}/>
                <Message messageKey='AnalyseView.showFeatureData' />
            </InlineGroup>
            { state.showDataWithoutSaving && (
                <InlineGroup>
                    <Switch size='small'
                    checked={state.showDataWithoutSaving}
                    onChange={checked => setValue('showDataWithoutSaving', checked)}/>
                    <Message messageKey='AnalyseView.showFeatureData' />
                </InlineGroup>
            )}
        </Content>
    );
};

Params.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
