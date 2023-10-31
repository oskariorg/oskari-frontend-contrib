import styled from 'styled-components';
import { Radio, Switch, Select } from 'oskari-ui';

export const Content = styled.div`
    display: flex;
    flex-direction: column;
`;

export const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
`;

export const StyledSwitch = styled(Switch)`
    margin-right: 10px;
`;

export const StyledSelect = styled(Select)`
    width: 80%;
    margin-bottom: 10px;
`;

export const Group = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
`;

export const Space = styled.div`
    margin-bottom: 10px;
`;

export const InlineGroup = styled.div`
    display: flex;
    flex-flow: row nowrap;
    margin-bottom: 10px;
`;

export const JustifiedGroup = styled(InlineGroup)`
    justify-content: space-between;
`;

export const Label = styled(JustifiedGroup)`
    font-weight: bold;
`;
