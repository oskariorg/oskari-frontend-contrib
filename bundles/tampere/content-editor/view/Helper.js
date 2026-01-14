const GEOM_TYPE_MAPPING = {
    'MultiPoint': 'MultiPoint',
    'gml:MultiPointPropertyType': 'MultiPoint',

    'Point': 'Point',
    'gml:PointPropertyType': 'Point',

    'MultiLineString': 'MultiLineString',
    'gml:MultiLineStringPropertyType': 'MultiLineString',

    'MultiPolygon': 'MultiPolygon',
    'gml:MultiPolygonPropertyType': 'MultiPolygon',
    'gml:MultiSurfacePropertyType': 'MultiPolygon',

    'Polygon': 'Polygon',
    'gml:PolygonPropertyType': 'Polygon',
    'gml:SurfacePropertyType': 'Polygon',

    'gml:GeometryPropertyType': 'GeometryPropertyType'
};

const detectGeometryType= (type) => GEOM_TYPE_MAPPING[type] || GEOM_TYPE_MAPPING['gml:' + type];

const describeLayer = (id) => {
    // TODO: change to use DescribeLayer on 2.11+
    return fetch(Oskari.urls.getRoute('DescribeLayer', { id: id }), {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error getting layer details');
    }).then(json => {
        /*
         * {
         *  ... 
         *  "properties": [
         *     {
         *       "name": "C_RAKEAINE",
         *       "type": "string",
         *       "rawType": "string",
         *       "hidden": false
         *     },
         *     {
         *       "name": "GEOLOC",
         *       "type": "geometry",
         *       "rawType": "PointPropertyType",
         *       "hidden": false
         *     }
         *  ]
         * }
          */
        
        
        let geometryType = "";
        const types = json.properties.reduce((acc, prop) => {
            if(prop.type === 'geometry'){
                geometryType = prop.rawType;
            }
            acc[prop.name] = prop.type;
            return acc;
        }, {});
      
        return {
            types,
            geometryType: detectGeometryType(geometryType)
        };
    });
};

export const Helper = {
    detectGeometryType,
    describeLayer
};
