import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Link, Message } from 'oskari-ui';
import { ButtonContainer, SecondaryButton } from 'oskari-ui/components/buttons';
import { COOKIE_KEY, COOKIE_SKIP_VALUE } from '../constants';
import { InlineGroup, StyledSwitch } from './styled';

const Margin = styled.div`
    margin-bottom: 20px;
`;
const Login = styled.a`
    margin-right: 20px;
`;
export const FlyoutContent = ({ setEnabled }) => {
    if (!Oskari.user().isLoggedIn()) {
        return (
            <Fragment>
                <Message messageKey='NotLoggedView.discountedNotice'/>
                <Margin/>
                <Message messageKey='NotLoggedView.text'/>
                <Margin/>
                <InlineGroup>
                    <Login href={Oskari.urls.getLocation('login')} target='_self'>
                        <Message messageKey='NotLoggedView.signup'/>
                    </Login>
                    <Link url={Oskari.urls.getLocation('register')}>
                        <Message messageKey='NotLoggedView.register'/>
                    </Link>
                </InlineGroup>
            </Fragment>
        );
    }
    const onChange = checked => {
        const expires = checked ? 365 : 1;
        const value =  checked ? COOKIE_SKIP_VALUE : '0';
        jQuery.cookie(COOKIE_KEY, value, { expires });
    };
    return (
        <Fragment>
            <Message messageKey='StartView.discountedNotice'/>
            <Margin/>
            <Message messageKey='StartView.text'/>
            <Margin/>
            <Margin>
                <StyledSwitch size='small' onChange={onChange} />
                <Message messageKey='StartView.infoseen.label'/>
            </Margin>
            <ButtonContainer>
                <SecondaryButton type='cancel' onClick={() => setEnabled(false)} />
                <Button type='primary' className='t_continue' onClick={() => setEnabled(true)}>
                    <Message messageKey='StartView.buttons.continue'/>
                </Button>
            </ButtonContainer>
        </Fragment>
    );
};

FlyoutContent.propTypes = {
    setEnabled: PropTypes.func.isRequired,
};
