import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { MetadataIcon } from 'oskari-ui/components/icons';
import { Content, RadioGroup } from './styled';

//div
const LayerBox = styled(Radio.Choice)`
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-height: 32px;
    background-color: ${props => props.disabled ? '#999999' : '#ffffff'};
    opacity: ${props => props.disabled ? '0.5' : '1'};
    padding: 3px 10px 3px 5px;
    margin-top: 5px;
    box-shadow: ${props => props.disabled ? 'none' : '1px 1px 2px rgb(0 0 0 / 60%)'};
`;

const LayerTitle = styled('span')`
    margin-right: 5px;
`;

const LayerContainer = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 20px;
`;

export const Layers = ({ controller, state, layers }) => {
    
    return (
        <Content>
            <RadioGroup value={state.layerId}
                onChange={(e) => controller.setAnalysisLayerId(e.target.value)}>
                {allLayers.map((layer) => (
                    <LayerBox key={layer.getId()} disabled={disabled}>
                        <LayerTitle>{layer.getName()}</LayerTitle>
                        <MetadataIcon metadataId={layer.getMetadataIdentifier()} />
                        <IconButton type='delete'
                            onClick={() => controller.removeLayer(layer.getId())} />
                    </LayerBox>
                ))}
            </RadioGroup>
            {allLayers.length === 0 && <Message messageKey='AnalyseView.content.noLayers' /> }
            <ButtonContainer>
                <Button onClick={() => controller.openSelectedLayerList()}>
                    <Message messageKey='AnalyseView.buttons.data' />
                </Button>
                <Button onClick={() => controller.openPlaceSearch()}>
                    <Message messageKey='AnalyseView.content.search.title' />
                </Button>
            </ButtonContainer>
        </Content>
    );
};

Layers.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layers: PropTypes.array.isRequired
};
