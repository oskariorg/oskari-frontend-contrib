import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, NumberInput, Tooltip } from 'oskari-ui';
import styled from 'styled-components';

export const StyledFormField = styled('div')`
    padding-top: 5px;
    padding-bottom: 10px;
    width: 100%;
`;
export const StyledLabel = styled('label')`
    display:block;
`;

const getFieldForType = (name, type, value, onUpdate) => {
    const attribs = {
        disabled: name === 'id',
        name,
        value
    };
    if (type === 'number') {
        return (<NumberInput {...attribs} onChange={(newValue) => onUpdate(name, newValue)}/>);
    }
    return (<TextInput {...attribs} onChange={(evt) => onUpdate(name, evt.target.value)} />);
}

const getDecorated = ({ name, type, value, onUpdate }) => {
    const labelValue = (<Tooltip title={name} >{name}</Tooltip>)
    return (
        <StyledFormField key={name}>
            <StyledLabel>{labelValue}</StyledLabel>
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
            <pre>{JSON.stringify(config, null, 2)}</pre>
            <pre>{JSON.stringify(feature, null, 2)}</pre>
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