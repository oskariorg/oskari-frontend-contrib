import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message, Radio, Button } from 'oskari-ui';
import { MetadataIcon } from 'oskari-ui/components/icons';
import { Content, RadioGroup } from './styled';
import { IconButton, ButtonContainer } from 'oskari-ui/components/buttons'

const LayerBox = styled.div`
    border-radius: 5px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    min-height: 32px;
    background-color: ${props => props.disabled ? '#999999' : '#ffffff'};
    opacity: ${props => props.disabled ? '0.5' : '1'};
    padding: 3px 10px 3px 5px;
    margin-top: 5px;
    margin-bottom: 5px;
    box-shadow: ${props => props.disabled ? 'none' : '1px 1px 2px rgb(0 0 0 / 60%)'};
`;

const LayerTitle = styled('span')`
    margin-right: 5px;
`;

const Actions = styled(ButtonContainer)`
    justify-content: flex-start;
`;

export const Layers = ({ controller, state, layers }) => {
    
    return (
        <Content>
            <RadioGroup value={state.layerId}
                onChange={(e) => controller.setAnalysisLayerId(e.target.value)}>
                {layers.map((layer) => {
                    const layerId = layer.getId();
                    return (
                        <LayerBox key={layerId} >
                            <Radio.Choice value={layerId}>
                                <LayerTitle>{layer.getName()}</LayerTitle>
                            </Radio.Choice>
                            <MetadataIcon metadataId={layer.getMetadataIdentifier()} />
                            <IconButton type='delete'
                                onClick={() => controller.removeLayer(layer.getId())} />
                        </LayerBox>
                    );
                })}
            </RadioGroup>
            {layers.length === 0 && <Message messageKey='AnalyseView.content.noLayersSelected' /> }
            <Actions>
                <Button type='primary' onClick={() => controller.openFlyout('layerlist')}>
                    <Message messageKey='AnalyseView.buttons.data' />
                </Button>
                <Button type='primary' onClick={() => controller.openFlyout('search')}>
                    <Message messageKey='AnalyseView.content.search.title' />
                </Button>
            </Actions>
        </Content>
    );
};

Layers.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layers: PropTypes.array.isRequired
};
