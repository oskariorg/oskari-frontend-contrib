import 'oskari-loader!oskari-frontend/packages/mapping/ol3/mapmodule/bundle.js';
import 'oskari-loader!oskari-frontend/packages/mapping/ol3/mapwmts/bundle.js';
// try to find a workaround to import mapwfs2 inside wfsvector for developer friendliness 
// since main.js needs to be modified for 1.53 and without a workaround in 1.54 also 
// Code from mapwfs2 will be moved here in 1.54 and mapwfs2 will be removed
import 'oskari-loader!oskari-frontend/packages/mapping/ol3/mapwfs2/bundle.js';
import 'oskari-loader!oskari-frontend/packages/mapping/ol3/wfsvector/bundle.js';
import 'oskari-loader!oskari-frontend/packages/mapping/ol3/maparcgis/bundle.js';
import 'oskari-loader!oskari-frontend/packages/mapping/ol3/mapuserlayers/bundle.js';
import 'oskari-loader!oskari-frontend/packages/framework/bundle/mapfull/bundle.js';
import 'oskari-loader!oskari-frontend/packages/framework/bundle/oskariui/bundle.js';
import 'oskari-loader!oskari-frontend/packages/framework/bundle/ui-components/bundle.js';

import 'oskari-loader!oskari-frontend/packages/mapping/ol3/toolbar/bundle.js';

import 'oskari-loader!oskari-frontend/packages/framework/bundle/publishedstatehandler/bundle.js';

import 'oskari-loader!oskari-frontend/packages/framework/bundle/divmanazer/bundle.js';

import 'oskari-loader!oskari-frontend/packages/framework/featuredata2/bundle.js';

import 'oskari-loader!oskari-frontend/packages/mapping/ol3/infobox/bundle.js';

import 'oskari-loader!oskari-frontend/packages/mapping/ol3/drawtools/bundle.js';

import 'oskari-loader!oskari-frontend/packages/framework/bundle/coordinatetool/bundle.js';

import 'oskari-loader!oskari-frontend/packages/framework/bundle/timeseries/bundle.js';

import 'oskari-lazy-loader?statsgrid!oskari-frontend/packages/statistics/statsgrid/bundle.js';

import 'oskari-loader!oskari-frontend/packages/framework/bundle/rpc/bundle.js';

import './css/overwritten.css';
