/**
 * @class Oskari.mapframework.bundle.mapanalysis.MapAnalysisBundle
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.mapanalysis.MapAnalysisBundle",
    function () {},
    {
        /*
         * implementation for protocol 'Oskari.bundle.Bundle'
         */
        "create": function () {
            return null;
        },
        "update": function (manager, bundle, bi, info) {
            manager.alert("RECEIVED update notification " + info);
        }
    },

    /**
     * metadata
     */
    {

        "protocol": ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
        "source": {

            "scripts": [{
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapanalysis/plugin/AnalysisLayerPlugin.ol.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapanalysis/domain/AnalysisLayer.js"
            }],
            "locales": [{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapanalysis/resources/locale/fi.js"
            }, {
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapanalysis/resources/locale/sv.js"
            }, {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapanalysis/resources/locale/en.js"
            }, {
                "lang": "fr",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapanalysis/resources/locale/fr.js"
            }, {
                "lang": "ru",
                "type": "text/javascript",
                "src": "../../../../bundles/mapping/mapanalysis/resources/locale/ru.js"
            }]
        },
        "bundle": {
            "manifest": {
                "Bundle-Identifier": "mapanalysis",
                "Bundle-Name": "mapanalysis",
                "Bundle-Tag": {
                    "mapframework": true
                },
                "Bundle-Icon": {
                    "href": "icon.png"
                },
                "Bundle-Author": [{
                    "Name": "jjk",
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2009",
                        "End": "2011"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Name-Locale": {
                    "fi": {
                        "Name": "Analysis",
                        "Title": "Analysis"
                    },
                    "en": {}
                },
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"]
            }
        }
    }
);

Oskari.bundle_manager.installBundleClass("mapanalysis", "Oskari.mapframework.bundle.mapanalysis.MapAnalysisBundle");