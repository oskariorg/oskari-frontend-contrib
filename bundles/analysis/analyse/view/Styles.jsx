import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { PrimaryButton } from 'oskari-ui/components/buttons';
import { Content } from './styled';

export const Styles = ({ controller, state }) => {
    return (
        <Content>
            <PrimaryButton type='edit' onClick={() => controller.editStyle()} />
        </Content>
    );
};

Styles.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
