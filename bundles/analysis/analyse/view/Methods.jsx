import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Message, Radio } from 'oskari-ui';
import { Content, RadioGroup, JustifiedGroup } from './styled';
import { InfoIcon } from 'oskari-ui/components/icons';
import { METHODS, METHOD_OPTIONS } from '../constants';

export const Methods = ({ controller, state, layersCount, layer }) => {
    const disabledMethods = METHODS.filter(method => {
        const { minLayers = 0, validateLayer = [] } = METHOD_OPTIONS[method] || {};
        if (layersCount < minLayers) {
            return false;
        }
        return !validateLayer.every(func => func(layer));
    });
    return (
        <Content>
            <RadioGroup value={state.method}
                onChange={(e) => controller.setMethod(e.target.value)}>
                {METHODS.map(method => {
                    const disabled = disabledMethods.includes(method)
                    return (
                        <JustifiedGroup key={method}>
                            <Radio.Choice value={method} disabled={disabled} className={`t_${method}`}>
                                <Message messageKey={`AnalyseView.method.options.${method}.label`}/>
                            </Radio.Choice>
                            <InfoIcon title={<Message messageKey={`AnalyseView.method.options.${method}.tooltip`}/>} />
                        </JustifiedGroup>
                    );
                })}
            </RadioGroup>
        </Content>
    );
};

Methods.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
