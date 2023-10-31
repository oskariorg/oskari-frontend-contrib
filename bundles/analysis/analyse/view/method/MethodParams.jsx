import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { METHOD_OPTIONS } from '../../constants';

import { Buffer } from './Buffer';
import { Aggregate } from './Aggregate';
import { Difference } from './Difference';
import { Clip } from './Clip';
import { Intersect } from './Intersect';
import { LayerUnion } from './LayerUnion';
import { SpatialJoin } from './SpatialJoin';
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
    const { noParams, minLayers = 0 } = METHOD_OPTIONS[method] || {};
    if (noParams) {
        return null;
    }
    if (layers.length < minLayers) {
        return (
            <Container>
                <Message messageKey='AnalyseView.content.noLayersForMethod'/>
            </Container>
        );
    }
    return (
        <Container>
            {method === 'buffer' && <Buffer controller={controller} params={methodParams}/>}
            {method === 'aggregate' && <Aggregate controller={controller} layer={layer} params={methodParams}/>}
            {method === 'clip' && <Clip controller={controller} layer={layer} layers={layers} state={state}/>}
            {method === 'intersect' && <Intersect controller={controller} layer={layer} layers={layers} state={state}/>}
            {method === 'layer_union' && <LayerUnion controller={controller} layer={layer} layers={layers} state={state}/>}
            {method === 'areas_and_sectors' && <AreasAndSectors controller={controller} params={methodParams}/>}
            {method === 'difference' && <Difference controller={controller} layer={layer} layers={layers} state={state}/>}
            {method === 'spatial_join' && <SpatialJoin controller={controller} layer={layer} layers={layers} state={state} />}
        </Container>
    );
};

MethodParams.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layer: PropTypes.object,
    layers: PropTypes.array.isRequired
};
