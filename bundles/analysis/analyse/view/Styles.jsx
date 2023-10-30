import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { Content } from './styled';

export const Styles = ({ controller }) => {
    return (
        <Content>
            <PrimaryButton type='edit' onClick={() => controller.openStyleEditor()} />
        </Content>
    );
};

Styles.propTypes = {
    controller: PropTypes.instanceOf(Controller).isRequired
};
