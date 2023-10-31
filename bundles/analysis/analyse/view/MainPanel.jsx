import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller, ThemeProvider, LocaleProvider } from 'oskari-ui/util';
import { Collapse, CollapsePanel, Message, Button } from 'oskari-ui';
import { ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import { InfoIcon } from 'oskari-ui/components/icons';

import { Layers } from './Layers';
import { Tools } from './Tools';
import { Methods } from './Methods';
import { Params } from './Params';
import { Styles } from './Styles';

import { BUNDLE_KEY } from '../constants';

const StyledPanelHeader = styled('div')`
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    font-weight: bold;
`;

const Actions = styled(ButtonContainer)`
    margin-top: 20px;
    padding-right: 15px;
`;

const PanelHeader = ({ headerMsg, infoMsg }) => {
    return (
        <StyledPanelHeader>
            <Message messageKey={headerMsg} />
            {infoMsg && <InfoIcon title={<Message messageKey={infoMsg} />} /> }
        </StyledPanelHeader>
    );
}

export const MainPanel = ({ controller, state, onClose, layers, featureIds }) => {
    const [openPanels, setOpenPanels] = useState(['layers', 'tools', 'methods', 'params']);
    const allLayers = [...layers, ...state.tempLayers ];
    const layer = allLayers.find(l => l.getId() === state.layerId);
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <ThemeProvider>
                <Collapse defaultActiveKey={openPanels} onChange={setOpenPanels}>
                    <CollapsePanel header={<PanelHeader headerMsg='AnalyseView.content.label' infoMsg='AnalyseView.content.tooltip'/>} key={'layers'}>
                        <Layers state={state} layers={allLayers} controller={controller} />
                    </CollapsePanel>
                    <CollapsePanel header={<PanelHeader headerMsg='AnalyseView.content.selectionToolsLabel' infoMsg='AnalyseView.content.selectionToolsTooltip'/>} key={'tools'}>
                        <Tools filter={state.filter} featureIds={featureIds} controller={controller} />
                    </CollapsePanel>
                    <CollapsePanel header={<PanelHeader headerMsg='AnalyseView.method.label' infoMsg='AnalyseView.method.tooltip'/>} key={'methods'}>
                        <Methods state={state} controller={controller} layersCount={allLayers.length} layer={layer}/>
                    </CollapsePanel>
                    <CollapsePanel header={<PanelHeader headerMsg='AnalyseView.settings.label' infoMsg='AnalyseView.settings.tooltip'/>} key={'params'}>
                        <Params state={state} controller={controller} layers={allLayers} layer={layer} />
                    </CollapsePanel>
                    <CollapsePanel header={<PanelHeader headerMsg='AnalyseView.output.label' infoMsg='AnalyseView.output.tooltip'/>} key={'styles'}>
                        <Styles state={state} controller={controller} />
                    </CollapsePanel>
                </Collapse>
                <Actions>
                    <SecondaryButton onClick={onClose} type='cancel' />
                    <Button type='primary' className='t_button' onClick={() => controller.commitAnalysis()}>
                        <Message messageKey='AnalyseView.buttons.analyse'/>
                    </Button>
                </Actions>
            </ThemeProvider>
        </LocaleProvider>
    );
};

MainPanel.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    featureIds: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    layers: PropTypes.array.isRequired
};
