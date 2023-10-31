import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { Table } from 'oskari-ui/components/Table';
import { ButtonContainer, PrimaryButton } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window';
import { BUNDLE_KEY  } from '../../constants';

const Content = styled.div`
    padding: 24px;
    min-width: 300px;
`;

const getColumnSettings = (prop) => {
    const title = prop === 'key'
        ? Oskari.getMsg(BUNDLE_KEY,'AnalyseView.aggregatePopup.property')
        : prop;
    return {
        align: 'left',
        title,
        dataIndex: prop,
        width: prop === 'key' ? 100 : 60
    };
};

const AggregateResults = ({ options = {}, aggregate, onClose }) => {
    const { labels = {}, noDataCnt } = options;
    const data = [];
    // Array Array is used for to keep order of rows and cols
    // WHY?? we can get row order from layer and cols from constant
    // TODO: backend [{ key/property, sum, avg..}] 
    aggregate.forEach(propertyObj => {
        let [prop, value] = Object.entries(propertyObj)[0];
        const row = value.reduce((data, agg) => {
                data = { ...data, ...agg };
                return data;
            }, { key: labels[prop] || prop });
        data.push(row);
    });
    const columns = Object.keys(data[0] || {}).map(prop => getColumnSettings(prop));
    return (
        <Content>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}/>
            { noDataCnt &&  <Message bundleKey={BUNDLE_KEY} messageKey='AnalyseView.aggregate.footer' /> }
            <ButtonContainer>
                <PrimaryButton type='close' onClick={() => onClose()}/>
            </ButtonContainer>
        </Content>
    );
};

AggregateResults.propTypes = {
    aggregate: PropTypes.array.isRequired,
    options: PropTypes.object,
    onClose: PropTypes.func.isRequired
};

export const showAggregateResults = (aggregate, options, onClose) => {
    return showPopup(
        <Message bundleKey={BUNDLE_KEY} messageKey='AnalyseView.aggregatePopup.title'/>,
        <AggregateResults aggregate={aggregate} options={options} onClose={onClose}/>,
        onClose,
        { id: `${BUNDLE_KEY}AggregateResults` }
    );
};
