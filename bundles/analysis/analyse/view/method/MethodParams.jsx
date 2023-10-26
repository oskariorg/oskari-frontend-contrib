import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { Content, RadioGroup } from './styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Buffer } from './Buffer';
import { Aggregate } from './Aggregate';
import { Difference } from './Difference';
import { Intersect } from './Intersect';
import { LayerUnion } from './LayerUnion';
import { SpatialJoin } from './SpatialJoin';
import { Union } from './Union';
import { AreasAndSectors } from './AreasAndSectors';

// Radio.Choice
const MethodContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;
// string.charAt(0).toUpperCase() + string.slice(1)
export const MethodParams = ({ 
    state,
    controller,
    analysisLayer,
    layers
}) => {
    const { method, targetLayerId, methodParams } = state;
    const targetLayer = layers.find(l => l.getId() === targetLayerId);
    return (
        <Content>
            {method === 'buffer' && <Buffer params={methodParams}/>}
            {method === 'aggregate' && <Aggregate params={methodParams}/>}
            {method === 'union' && <Union params={methodParams}/>}
            {method === 'clip' && <Intersect params={methodParams} skipSpatial/>}
            {method === 'intersect' && <Intersect params={methodParams}/>}
            {method === 'layer_union' && <LayerUnion params={methodParams}/>}
            {method === 'areas_and_sectors' && <AreasAndSectors params={methodParams}/>}
            {method === 'difference' && <Difference params={methodParams}/>}
            {method === 'spatial_join' && <SpatialJoin params={methodParams}/>}
        </Content>
    );
};

MethodParams.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    analysisLayer: PropTypes.object,
    layers: PropTypes.array.isRequired
};
