import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message } from 'oskari-ui';
import { ButtonContainer, PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import { showPopup, PLACEMENTS } from 'oskari-ui/components/window';
import { BUNDLE_KEY  } from '../constants';

const Content = styled.div`
    padding: 12px;
    width: 300px;
`;

const DrawHelper = ({ mode, onClose }) => {
    return (
        <Content>
            <Message messageKey={`AnalyseView.content.drawDialog.${mode}.add`} bundleKey={BUNDLE_KEY} />,
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => onClose(true)}/>
                <PrimaryButton type='add' onClick={() => onClose(false)}/>
            </ButtonContainer>
        </Content>
    );
};

DrawHelper.propTypes = {
    mode: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export const showDrawHelper = (mode, onClose) => {
    return showPopup(
        <Message bundleKey={BUNDLE_KEY} messageKey={`AnalyseView.content.drawDialog.${mode}.title`}/>,
        <DrawHelper mode={mode} onClose={onClose}/>,
        () => onClose(true),
        { id: `${BUNDLE_KEY}DrawHelper`, placement: PLACEMENTS.LEFT }
    );
};
