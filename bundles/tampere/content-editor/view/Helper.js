
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

    'gml:GeometryPropertyType': 'GeometryPropertyType'
};

const detectGeometryType= (type) => GEOM_TYPE_MAPPING[type] || GEOM_TYPE_MAPPING['gml:' + type];

const describeLayer = (id) => {
    // http://mydomain/action?action_route=GetWFSLayerFields&layer_id=888
    return fetch(Oskari.urls.getRoute('GetWFSLayerFields', { layer_id: id }), {
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
        {"geometryName":"geom",
        "types":{
            "nimi":"string",
            "numero":"number",
            "id":"number",
            "teksti":"string"
        },"geometryType":"MultiPointPropertyType"}

        NOTE! decimal number fields are only just "number". This might cause a problem
        */
        const { types, geometryType } = json;
        return {
            types,
            geometryType: detectGeometryType(geometryType)
        };
        /*
        aiemmin: /action?action_route=GetWFSDescribeFeature&layer_id=3324
        {"nimi":"xsd:string",
        "numero":"xsd:long",
        "id":"xsd:long",
        "geom":"gml:MultiPointPropertyType",
        "teksti":"xsd:string"}
        */
    });
};

export const Helper = {
    detectGeometryType,
    describeLayer
};
