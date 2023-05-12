import React from 'react';
import { showPopup, getNavigationDimensions, PLACEMENTS } from 'oskari-ui/components/window';
import { ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import { InfoIcon } from 'oskari-ui/components/icons';
import { Message, Button, Spin } from 'oskari-ui';
import styled from 'styled-components';
import { TerrainGraph } from './TerrainGraph';

const BUNDLE_NAME = 'TerrainProfile';
const StyledContent = styled('div')`
    min-width: 300px;
    margin: 12px 24px 24px;
`;
const InfoContainer = styled('div')`
    margin-left: 5px;
    display: inline-block;
`;

const PopupContent = ({ showProfile, data, markerHandler, loading, onClose }) => {
    const component = (
        <StyledContent>
            {data && (
                <TerrainGraph
                    data={data}
                    markerHandler={markerHandler}
                />
            )}
            <Message bundleKey={BUNDLE_NAME} messageKey='popupText' />
            <ButtonContainer>
                <SecondaryButton
                    type='cancel'
                    onClick={onClose}
                />
                <Button
                    type='primary'
                    onClick={showProfile}
                >
                    <Message bundleKey={BUNDLE_NAME} messageKey='showProfile' />
                </Button>
            </ButtonContainer>
        </StyledContent>
    );
    if (loading) {
        return (
            <Spin>
                {component}
            </Spin>
        )
    }
    return component;
};

const Header = ({}) => (
    <div>
        <Message bundleKey={BUNDLE_NAME} messageKey='popupTitle' />
        <InfoContainer>
            <InfoIcon>
                <Message bundleKey={BUNDLE_NAME} messageKey='headerTooltip' />
            </InfoIcon>
        </InfoContainer>
    </div>
);

export const showTerrainPopup = (showProfile, data = null, markerHandler, loading = false, onClose) => {
    const dimensions = getNavigationDimensions();
    let placement = PLACEMENTS.BL;
    if (dimensions?.placement === 'right') {
        placement = PLACEMENTS.BR;
    }
    const options = {
        id: 'terrain-profile',
        placement
    };
    
    const controls = showPopup(
        <Header />,
        <PopupContent showProfile={showProfile} data={data} markerHandler={markerHandler} loading={loading} onClose={onClose} />,
        onClose,
        options
    );
    return {
        ...controls,
        update: (newData, loadingState) => controls.update(
            <Header />,
            <PopupContent showProfile={showProfile} data={newData} markerHandler={markerHandler} loading={loadingState} onClose={onClose} />
        )
    };
};
