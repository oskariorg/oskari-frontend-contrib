import React from 'react';
import PropTypes from 'prop-types';
import { LocaleProvider } from 'oskari-ui/util';
import { AnalysisList } from './AnalysisList';
import { BUNDLE_KEY } from './constants';

export const AnalysisTab = ({ state, controller }) => {
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }} >
            <AnalysisList
                controller={controller}
                data={state.data}
                loading={state.loading}
            />
        </LocaleProvider>
    );
}

AnalysisTab.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired
}
