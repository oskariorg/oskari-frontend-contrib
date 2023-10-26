import styled from 'styled-components';
import {Radio} from 'oskari-ui';

export const Content = styled('div')`
    display: flex;
    flex-direction: column;
    margin-right: 10px;
`;

export const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
`;

export const Group = styled('div')`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

export const Label = styled('div')`
    font-weight: bold;
`;