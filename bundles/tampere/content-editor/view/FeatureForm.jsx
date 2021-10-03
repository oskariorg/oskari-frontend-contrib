import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, NumberInput, Tooltip } from 'oskari-ui';
import { Form, Row } from 'antd';
import styled from 'styled-components';

import 'antd/es/form/style/index.js';

const getFieldForType = (name, type, value) => {
    const attribs = {
        disabled: name === 'id',
        name,
        value
    };
    if (type === 'number') {
        return (<NumberInput {...attribs} />);
    }
    return (<TextInput {...attribs} />);
}

const getDecorated = (name, type, value) => {
    const label = (<Tooltip title={name} >{name}</Tooltip>)
    return (
        <Form.Item label={label} name={name} key={name}>
            { getFieldForType(name, type, value) }
        </Form.Item>
    );
    
}

export const FeatureForm = ({config = {}, feature = {}}) => {
    const fieldsTypes = config.fieldTypes || {};
    const featureProperties = feature.properties || {};
    const fields = Object.keys(fieldsTypes)
        .map(field => getDecorated(field, fieldsTypes[field], featureProperties[field]));

    return (
        <React.Fragment>
    <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        autoComplete="off">
                {fields}
            </Form>
        <pre>{JSON.stringify(config, null, 2)}</pre>
        <pre>{JSON.stringify(feature, null, 2)}</pre>
            </React.Fragment>)
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