import React from 'react';
import { showPopup, getNavigationDimensions, PLACEMENTS } from 'oskari-ui/components/window';
import { ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import { Message, Button } from 'oskari-ui';
import styled from 'styled-components';

const BUNDLE_NAME = 'TerrainProfile';
const StyledContent = styled('div')`
    width: 300px;
    margin: 12px 24px 24px;
`;

const PopupContent = ({ showProfile, onClose }) => {
    return (
        <StyledContent>
            <Message bundleKey={BUNDLE_NAME} messageKey='popupText' />
            <ButtonContainer>
                <SecondaryButton
                    type='cancel'
                    onClick={onClose}
                />
                <Button
                    onClick={showProfile}
                >
                    <Message bundleKey={BUNDLE_NAME} messageKey='showProfile' />
                </Button>
            </ButtonContainer>
        </StyledContent>
    );
};

export const showTerrainPopup = (showProfile, onClose) => {
    const dimensions = getNavigationDimensions();
    let placement = PLACEMENTS.BL;
    if (dimensions?.placement === 'right') {
        placement = PLACEMENTS.BR;
    }
    const options = {
        id: 'terrain-profile',
        placement
    };
    return showPopup(<Message bundleKey={BUNDLE_NAME} messageKey='popupTitle' />, <PopupContent showProfile={showProfile} onClose={onClose} />, onClose, options);
};
