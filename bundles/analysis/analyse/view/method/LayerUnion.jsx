import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import { Content } from '../styled';
import { LayerSelect } from './LayerSelect';
import { isAnalysisLayer, getProperties } from '../../service/AnalyseHelper';

const LABELS = {
    title: 'AnalyseView.layer_union.label',
    tooltip: 'AnalyseView.layer_union.labelTooltip',
    noLayers: 'AnalyseView.layer_union.noLayersAvailable'
};

const isValidLayer = (layer, props) => {
    if (!isAnalysisLayer(layer)){
        return false;
    }
    const layerProps = getProperties(layer);
    if (layerProps.length !== props.length) {
        return false;
    }
    return layerProps.every(p => props.includes(p));
}

export const LayerUnion = ({ 
    state,
    controller,
    layer,
    layers
}) => {
    if (!isAnalysisLayer(layer)) {
        return (
            <Message messageKey='AnalyseView.layer_union.notAnalyseLayer'/>
        );
    }
    const { layerId } = state;
    const props = getProperties(layer);
    const validLayers = layers.filter(l => l.getId() !== layerId && isValidLayer(l, props));

    return (
        <Content>
            <LayerSelect layers={validLayers} state={state} controller={controller} labels={LABELS}/>
        </Content>
    );
};

LayerUnion.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layer: PropTypes.object,
    layers: PropTypes.array.isRequired
};
