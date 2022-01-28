import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Message, Button } from 'oskari-ui';
import { SecondaryButton, PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { showPopup } from 'oskari-ui/components/window';
import { StyleEditor } from 'oskari-ui/components/StyleEditor';
import { BUNDLE_KEY, DEFAULT_STYLE } from './constants';

const Content = styled.div`
    padding: 24px;
    width: 500px;
`;

const getMessage = key => <Message messageKey={ `AnalyseView.output.${key}` } bundleKey={BUNDLE_KEY} />;

const StyleForm = ({ style: initStyle, onSave, onCancel }) => {
    const [style, setStyle] = useState(initStyle);
    return (
        <Content>
            <StyleEditor
                oskariStyle={ style }
                onChange={ setStyle }
            />
            <ButtonContainer>
                <Button onClick={() => setStyle(DEFAULT_STYLE)}>{getMessage('defaultStyle')}</Button>
                <SecondaryButton type='cancel' onClick={onCancel}/>
                <PrimaryButton type='save' onClick={() => onSave(style) }/>
            </ButtonContainer>
        </Content>
    );
};

StyleForm.propTypes = {
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    style: PropTypes.object.isRequired
};

export const showStyleEditor = (style, onSave, onClose) => {
    return showPopup(
        getMessage('label'),
        (<StyleForm style={style} onSave={onSave} onCancel={onClose}/>),
        onClose,
        { id: BUNDLE_KEY }
    );
};
