import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';

import { Buffer } from './Buffer';
import { Aggregate } from './Aggregate';
import { Difference } from './Difference';
import { Clip } from './Clip';
import { Intersect } from './Intersect';
import { LayerUnion } from './LayerUnion';
import { SpatialJoin } from './SpatialJoin';
import { Union } from './Union';
import { AreasAndSectors } from './AreasAndSectors';

const Container = styled.div`
    margin-bottom: 10px;
`;

export const MethodParams = ({ 
    state,
    controller,
    layer,
    layers
}) => {
    const { method, methodParams } = state;
    return (
        <Container>
            {method === 'buffer' && <Buffer controller={controller} params={methodParams}/>}
            {method === 'aggregate' && <Aggregate controller={controller} params={methodParams}/>}
            {method === 'union' && <Union controller={controller} params={methodParams}/>}
            {method === 'clip' && <Clip controller={controller} layer={layer} layers={layers} state={state}/>}
            {method === 'intersect' && <Intersect controller={controller} layer={layer} layers={layers} state={state}/>}
            {method === 'layer_union' && <LayerUnion controller={controller} layer={layer} layers={layers} state={state}/>}
            {method === 'areas_and_sectors' && <AreasAndSectors controller={controller} params={methodParams}/>}
            {method === 'difference' && <Difference controller={controller} layer={layer} layers={layers} state={state}/>}
            {method === 'spatial_join' && <SpatialJoin controller={controller} params={methodParams}/>}
        </Container>
    );
};

MethodParams.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layer: PropTypes.object,
    layers: PropTypes.array.isRequired
};