import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'oskari-ui';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import { BUNDLE_KEY } from '../constants';
import { DeleteButton } from 'oskari-ui/components/buttons';

export const AnalysisList = ({ data = [], controller, loading }) => {

    const columnSettings = [
        {
            dataIndex: 'name',
            align: 'left',
            title: <Message messageKey='personalDataTab.grid.name' bundleKey={BUNDLE_KEY} />,
            sorter: getSorterFor('name'),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => controller.openAnalysis(item.key)}>{title}</a>
                );
            }
        },
        {
            dataIndex: 'id',
            align: 'left',
            title: <Message messageKey='personalDataTab.grid.actions' bundleKey={BUNDLE_KEY} />,
            width: 100,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <DeleteButton
                            type='icon'
                            title={<Message messageKey='personalDataTab.confirmDeleteMsg' messageArgs={{ name: item.name }} bundleKey={BUNDLE_KEY} />}
                            onConfirm={() => controller.deleteAnalysis(item.key)} />
                    </ToolsContainer>
                );
            }
        }
    ];
    return (
        <Table
            columns={columnSettings}
            dataSource={data.map(item => ({
                key: item.getId(),
                ...item.getLocaleValues()
            }))}
            pagination={false}
            loading={loading}
        />
    );
};

AnalysisList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    controller: PropTypes.object.isRequired,
    loading: PropTypes.bool
}
