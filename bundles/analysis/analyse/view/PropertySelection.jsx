import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Switch, Message, Radio } from 'oskari-ui';
import { InfoIcon } from 'oskari-ui/components/icons';
import { IconButton } from 'oskari-ui/components/buttons';
import { Label, RadioGroup, InlineGroup } from './styled';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { PROPERTIES, LIMITS } from '../constants';
import { getProperties } from '../service/AnalyseHelper';

const SKIP_SELECTION = ['difference', 'spatial_join'];
const propOptions = Object.values(PROPERTIES);

export const PropertySelection = ({ controller, state, layer }) => {
    const { method, properties: { type, selected }} = state;
    const [showList, setShowList] = useState(type === PROPERTIES.SELECT);
    if (SKIP_SELECTION.includes(method)) {
        return null;
    }
    const properties = getProperties(layer);
    const labels = layer?.getPropertyLabels() || {};
    const onPropertyChange = (isAdd, prop) => {
        const updated = isAdd ? [...selected, prop] : selected.filter(p => p !== prop);
        controller.setProperties('selected', updated);
    };
    const onTypeChange = type => {
        setShowList(type === PROPERTIES.SELECT);
        controller.setProperties('type', type);
    }
    const isDisabled = type => {
        if (properties.length === 0 && type !== PROPERTIES.NONE) {
            return true;
        }
        if (type === PROPERTIES.ALL) {
            return properties.length <= LIMITS.properties;
        }
        return false;
    };
    const locKey = method === 'aggregate' ? 'aggreLabel' : 'label';
    const hasMaxSelected =  selected.length >=  LIMITS.properties;
    return (
        <Fragment>
            <Label>
                <Message messageKey={`AnalyseView.params.${locKey}`} />
                <InfoIcon title={<Message messageKey={`AnalyseView.params.${locKey}Tooltip`} />} />
            </Label>
            <RadioGroup value={type}
                onChange={e => onTypeChange(e.target.value)} >
                {propOptions.map(opt => (
                    <InlineGroup>
                        <Radio.Choice value={opt} key={opt} disabled={isDisabled(opt)}>
                            <Message messageKey={`AnalyseView.params.options.${opt}`} />
                        </Radio.Choice>
                        { opt === PROPERTIES.SELECT &&
                            <IconButton
                                icon={showList? <UpOutlined/> : <DownOutlined/>}
                                onClick={() => setShowList(!showList)}/>
                        }
                    </InlineGroup>
                ))}
            </RadioGroup>
            { showList && properties.map(prop => {
                const checked = selected.includes(prop);
                return (
                    <Label key={prop}>
                        <Switch size='small' checked={checked}
                            disabled={hasMaxSelected && !checked}
                            onChange={checked => onPropertyChange(checked, prop)} />
                        <span>{labels[prop] || prop}</span>
                    </Label>
                )})
            }
        </Fragment>
    );
};

PropertySelection.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layer: PropTypes.object
};
