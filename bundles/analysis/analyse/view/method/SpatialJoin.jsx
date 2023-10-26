import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { Content, RadioGroup } from './styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Buffer } from './Buffer';

// Radio.Choice
const MethodContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;
// string.charAt(0).toUpperCase() + string.slice(1)
export const SpatialJoin = ({ 
    state,
    controller,
    analysisLayer,
    layers
}) => {
    const targetLayer = layers.find(l => l.getId() === state.targetLayerId);
    return (
        <Content>
            
        </Content>
    );
};

SpatialJoin.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    analysisLayer: PropTypes.object,
    layers: PropTypes.array.isRequired
};
