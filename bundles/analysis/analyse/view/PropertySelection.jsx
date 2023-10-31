import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import { IconButton } from 'oskari-ui/components/buttons';
import { Label, RadioGroup, InlineGroup, StyledSwitch, JustifiedGroup } from './styled';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { PROPERTIES, LIMITS, METHOD_OPTIONS } from '../constants';
import { getProperties } from '../service/AnalyseHelper';

const propOptions = Object.values(PROPERTIES);

const ListContainer = styled.div`
    margin-left: 20px;
`;

const PropertiesList = ({properties, labels = {}, selected, onUpdate}) => {
    const hasMaxSelected =  selected.length >=  LIMITS.properties;

    const onPropertyChange = (isAdd, prop) => {
        const updated = isAdd ? [...selected, prop] : selected.filter(p => p !== prop);
        onUpdate(updated);
    };
    return (
        <ListContainer>
            { properties.map(prop => {
                const checked = selected.includes(prop);
                return (
                    <InlineGroup key={prop}>
                        <StyledSwitch size='small' checked={checked}
                            disabled={hasMaxSelected && !checked}
                            onChange={checked => onPropertyChange(checked, prop)} />
                        <span>{labels[prop] || prop}</span>
                    </InlineGroup>
                );
            })}
        </ListContainer>
    );
};

export const PropertySelection = ({ controller, state, layer }) => {
    const { method, properties: { type, selected }} = state;
    const [showList, setShowList] = useState(type === PROPERTIES.SELECT);
    if (METHOD_OPTIONS[method]?.skipPropertySelection) {
        return null;
    }
    const properties = getProperties(layer);

    const onTypeChange = type => {
        setShowList(type === PROPERTIES.SELECT);
        controller.setProperties('type', type);
    };
    const isDisabled = type => {
        if (properties.length === 0 && type !== PROPERTIES.NONE) {
            return true;
        }
        if (type === PROPERTIES.ALL) {
            return properties.length > LIMITS.properties;
        }
        return false;
    };
    const locKey = method === 'aggregate' ? 'aggreLabel' : 'label';

    return (
        <Fragment>
            <Label>
                <Message messageKey={`AnalyseView.params.${locKey}`} />
                <InfoIcon title={<Message messageKey={`AnalyseView.params.${locKey}Tooltip`} />} />
            </Label>
            <RadioGroup value={type}
                onChange={e => onTypeChange(e.target.value)} >
                {propOptions.map(opt => (
                    <JustifiedGroup key={opt}>
                        <Radio.Choice value={opt} disabled={isDisabled(opt)}>
                            <Message messageKey={`AnalyseView.params.options.${opt}`} />
                        </Radio.Choice>
                        { opt === PROPERTIES.SELECT &&
                            <IconButton
                                icon={showList? <UpOutlined/> : <DownOutlined/>}
                                onClick={() => setShowList(!showList)}/>
                        }
                    </JustifiedGroup>
                ))}
            </RadioGroup>
            { showList && <PropertiesList properties={properties} selected={selected}
                onUpdate = {updated => controller.setProperties('selected', updated)}
                labels = {layer?.getPropertyLabels()}/>
            }
        </Fragment>
    );
};

PropertySelection.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layer: PropTypes.object
};
