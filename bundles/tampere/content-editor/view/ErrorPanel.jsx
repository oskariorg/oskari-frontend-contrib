import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'oskari-ui';

export const ErrorPanel = ({ loading = false }) => {
    if (loading) {
        return (<Spin>Ladataan tason tietoja...</Spin>);
    }
    return (<div>Tason tiedot puuttuvat!!</div>);
};


ErrorPanel.propTypes = {
    loading: PropTypes.bool
};