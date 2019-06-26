/**
 * Definition for bundle. See source for details.
 *
 * @class Oskari.elf.geolocator.Bundle
 */
Oskari.clazz.define("Oskari.guidedtourextension.Bundle", function() {

}, {
    "create" : function() {
        return Oskari.clazz.create(
            "Oskari.framework.bundle.guidedtourextension.BundleInstance",
            "guided-tour-extension");
    },
    "update" : function(manager, bundle, bi, info) {
    }
}, {
    "protocol" : [
        "Oskari.bundle.Bundle",
        "Oskari.mapframework.bundle.extension.ExtensionBundle"
    ],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/asdi/guided-tour-extension/instance.js"
        }],
        "locales" : [
            {
                "lang": "en",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/guided-tour-extension/resources/locale/en.js"
            }, {
                "lang": "fr",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/guided-tour-extension/resources/locale/fr.js"
            }, {
                "lang": "ru",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/guided-tour-extension/resources/locale/ru.js"
            },{
                "lang": "fi",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/guided-tour-extension/resources/locale/fi.js"
            },{
                "lang": "sv",
                "type": "text/javascript",
                "src": "../../../../bundles/asdi/guided-tour-extension/resources/locale/sv.js"
            }
        ]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "guided-tour-extension",
            "Bundle-Name" : "guided-tour-extension",
            "Bundle-Author" : [{
                "Name" : "mmustikkkamaa",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2019"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.oskari.org/documentation/development/license"
                    }
                }
            }],
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari", "jquery"],
            "Import-Bundle" : {}
        }
    },
    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("guided-tour-extension",
    "Oskari.guidedtourextension.Bundle");
