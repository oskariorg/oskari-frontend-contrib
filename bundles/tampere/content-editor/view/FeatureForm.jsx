import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, NumberInput } from 'oskari-ui';
import styled from 'styled-components';

export const StyledFormField = styled('div')`
    padding-top: 5px;
    padding-bottom: 10px;
    width: 100%;
`;

const Label = ({name, children}) => (<label>{name} {children}</label>);

const getFieldForType = (name, type, value, onUpdate) => {
    const attribs = {
        disabled: name === 'id',
        name,
        value
    };
    if (type === 'number') {
        return (<Label name={name}>
                    <NumberInput {...attribs}
                        onChange={(newValue) => onUpdate(name, newValue)}/>
                </Label>);
    }
    return (<TextInput {...attribs} 
                addonBefore={<Label name={name} />}
                onChange={(evt) => onUpdate(name, evt.target.value)} />);
}

const getDecorated = ({ name, type, value, onUpdate }) => {
    return (
        <StyledFormField key={name}>
            { getFieldForType(name, type, value, onUpdate) }
        </StyledFormField>
    );
    
}

export const FeatureForm = ({config = {}, feature = {}, onChange}) => {
    const fieldsTypes = config.fieldTypes || {};
    const featureProperties = feature.properties || {};

    const onUpdate = (name, value) => {
        onChange({
            ...feature,
            properties: {
                ...feature.properties,
                [name]: value
            }
        });
    };
    const fields = Object.keys(fieldsTypes)
        .map(field => getDecorated({
            name: field, 
            type: fieldsTypes[field], 
            value: featureProperties[field],
            onUpdate}));
    return (
        <React.Fragment>
            {fields}
        </React.Fragment>);
};

FeatureForm.propTypes = {
    feature: PropTypes.object,
    config: PropTypes.object,
    onChange: PropTypes.func
};
/*
{
    "id":2662,
    "geometryType":"MultiPoint",
    "fieldTypes":{
        "nimi":"string",
        "numero":"number",
        "id":"number",
        "teksti":"string"
    }
}
*/