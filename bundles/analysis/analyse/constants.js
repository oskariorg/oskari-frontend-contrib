export const BUNDLE_KEY = 'Analyse';
export const COOKIE_KEY = 'analyse_info_seen';
// Both color arrays have to be equal length
export const COLORS = [
    '#e31a1c', '#2171b5', '#238b45', '#88419d',
    '#2b8cbe', '#238b45', '#d94801', '#d7301f',
    '#0570b0', '#02818a', '#ce1256', '#6a51a3',
    '#ae017e', '#cb181d', '#238443', '#225ea8',
    '#cc4c02'
];
export const FILL_COLORS = [
    '#fd8d3c', '#6baed6', '#66c2a4', '#8c96c6',
    '#7bccc4', '#74c476', '#fd8d3c', '#fc8d59',
    '#74a9cf', '#67a9cf', '#df65b0', '#9e9ac8',
    '#f768a1', '#fb6a4a', '#78c679', '#41b6c4',
    '#fe9929'
];

export const LIMITS = {
    properties: 10,
    areas: 12,
    decimals: 2
};

export const FILTER = {
    // ALL: 'all', not supported, requires property filter
    BBOX: 'bbox',
    FEATURES: 'features'
};

export const PROPERTIES = {
    ALL: 'all',
    NONE: 'none',
    SELECT: 'select'
};

export const BUFFER = {
    'm': 1,
    'km': 1000
};

export const METHODS = [
    'buffer', 'aggregate', 'union', 'clip', 'intersect', 'layer_union', 'areas_and_sectors', 'difference', 'spatial_join'
];

export const AGGREGATE_OPTIONS = ['Count', 'Sum', 'Min', 'Max', 'Average', 'StdDev', 'Median', 'NoDataCnt'];

export const SPATIAL_OPTIONS = ['intersect', 'contains'];

export const SPATIAL_JOIN_MODES = ['normal', 'aggregate'];