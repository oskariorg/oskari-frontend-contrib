import React from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm, Tooltip } from 'oskari-ui';
import { Table, getSorterFor, ToolsContainer } from 'oskari-ui/components/Table';
import styled from 'styled-components';
import { BUNDLE_KEY } from './constants';
import { DeleteOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';

const StyledTable = styled(Table)`
    tr {
        th {
            padding: 8px 8px;
        }
        td {
            padding: 8px
        }
    }
`;

const deleteIconStyle = {
    fontSize: '16px',
    color: red.primary
};

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
                        <Confirm
                            title={<Message messageKey='personalDataTab.confirmDeleteMsg' messageArgs={{ name: item.name }} bundleKey={BUNDLE_KEY} />}
                            onConfirm={() => controller.deleteAnalysis(item.key)}
                            okText={<Message messageKey='personalDataTab.buttons.ok' bundleKey={BUNDLE_KEY} />}
                            cancelText={<Message messageKey='personalDataTab.buttons.cancel' bundleKey={BUNDLE_KEY} />}
                            placement='bottomLeft'
                        >
                            <Tooltip title={<Message messageKey='personalDataTab.grid.delete' />}>
                                <div className='icon t_delete'><DeleteOutlined style={deleteIconStyle} /></div>
                            </Tooltip>
                        </Confirm>
                    </ToolsContainer>
                );
            }
        }
    ];

    return (
        <StyledTable
            columns={columnSettings}
            dataSource={data.map(item => ({
                key: item._id,
                ...item,
                name: Oskari.getLocalized(item._name)
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
