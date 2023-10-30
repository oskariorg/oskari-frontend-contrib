import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Table, Message } from 'oskari-ui';
import { ButtonContainer, PrimaryButton } from 'oskari-ui/components/buttons';
import { BUNDLE_KEY  } from '../../constants';

const VECTOR_LAYER_ID = 'analysisAggregate';

const Content = styled.div`
    padding: 24px;
    width: 500px;
`;

const getColumnSettings = (prop, labels) => {
    const title = prop === 'key'
        ? <Message bundleKey={BUNDLE_KEY} messageKey='tabs.myviews.grid.default' />
        : labels[prop] || prop;
    return {
        align: 'left',
        title,
        dataIndex: prop,
        width: 60
    };
};

const AggregateResults = ({ layer, results, onClose }) => {
    const { aggregate, geojson } = results;
    const labels = layer.getPropertyLabels();
    const hasGeoJSON = typeof geojson !== 'undefined';
    // TODO: does backend return geojson??
    if (hasGeoJSON) {
        const { features } = geojson;
        Oskari.getSandbox().postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [features, {
            layerId: VECTOR_LAYER_ID,
            clearPrevious: true,
            centerTo: false
        }]);
    }

    const data = [];
    // Array Array is used for to keep order of rows and cols
    // WHY?? we can get row order from layer and cols from constant
    // TODO: backend [{ key/property, sum, avg..}] 
    aggregate.forEach(propertyObj => {
        let [key, value] = Object.entries(propertyObj)[0];
        const row = value.reduce((data, agg) => {
                data = { ...data, ...agg };
                return data;
            }, { key });
        data.push(row);
    });
    const columns = Object.keys(data[0] || {}).map(prop => getColumnSettings(prop, labels));
    const onCloseClick = () => {
        Oskari.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, VECTOR_LAYER_ID]);
        onClose();
    };
    const onStore = () => {
        // const feature = new olFormatGeoJSON().readFeatures(geojson)[0];
        // controller.addTempLayer({ feature });
    };
    return (
        <Content>
            <Table
            columns={columns}
            dataSource={data}
            pagination={false}/>
            { noDataCnt &&  <Message bundleKey={BUNDLE_KEY} messageKey='AnalyseView.aggregate.footer' /> }
            <ButtonContainer>
                { hasGeoJSON && (
                    <Button onClick={onStore}>
                        <Message bundleKey={BUNDLE_KEY} messageKey='AnalyseView.aggregate.footer' />
                    </Button> 
                )}
                <PrimaryButton type='close' onClick={onCloseClick}/>
            </ButtonContainer>
        </Content>
    );
};

AggregateResults.propTypes = {
    results: PropTypes.object.isRequired,
    layer: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
};

export const showAggregateResults = (layer, results, onClose) => {
    return showPopup(
        <Message messageKey={ `AnalyseView.output.${key}` } bundleKey={BUNDLE_KEY} />,
        <StyleForm results={results} layer={layer} onClose={onClose}/>,
        onClose,
        { id: BUNDLE_KEY }
    );
};
