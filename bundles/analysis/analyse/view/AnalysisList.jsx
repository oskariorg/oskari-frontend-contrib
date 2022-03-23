import React from 'react';
import PropTypes from 'prop-types';
import { Message, Confirm } from 'oskari-ui';
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
    fontSize: '14px',
    color: red.primary
};

export const AnalysisList = ({ data = [], handleDelete, openAnalysis }) => {

    const columnSettings = [
        {
            dataIndex: ['_name', 'fi'],
            align: 'left',
            title: <Message messageKey='personalDataTab.grid.name' bundleKey={BUNDLE_KEY} />,
            sorter: (a, b) => a._name.fi.localeCompare(b._name.fi),
            defaultSortOrder: 'ascend',
            render: (title, item) => {
                return (
                    <a onClick={() => openAnalysis(item)}>{title}</a>
                );
            }
        },
        {
            dataIndex: 'id',
            align: 'left',
            title: <Message messageKey='personalDataTab.grid.actions' bundleKey={BUNDLE_KEY} />,
            render: (title, item) => {
                return (
                    <ToolsContainer>
                        <Confirm
                            title={<Message messageKey='personalDataTab.confirmDeleteMsg' messageArgs={{ name: item._name.fi }} bundleKey={BUNDLE_KEY} />}
                            onConfirm={() => handleDelete(item)}
                            okText={<Message messageKey='personalDataTab.buttons.ok' bundleKey={BUNDLE_KEY} />}
                            cancelText={<Message messageKey='personalDataTab.buttons.cancel' bundleKey={BUNDLE_KEY} />}
                            placement='bottomLeft'
                        >
                            <div className='icon t_delete'><DeleteOutlined style={deleteIconStyle} /></div>
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
                ...item
            }))}
            pagination={false}
        />
    );
};

AnalysisList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    handleDelete: PropTypes.func.isRequired
}
