/**
 * @class Oskari.tampere.bundle.content-editor.ContentEditorBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.tampere.bundle.content-editor.ContentEditorBundle", function () {

}, {
    "create": function () {
        return Oskari.clazz.create("Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance");
    },
    "update": function () {}
}, {

    "source": {
        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/tampere/content-editor/instance.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/tampere/content-editor/resources/scss/style.scss"
        }],
        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/tampere/content-editor/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/tampere/content-editor/resources/locale/fi.js"
        }]
    },
    "bundle": {
        "manifest": {}
    },
    "dependencies": []
});

Oskari.bundle_manager.installBundleClass("content-editor", "Oskari.tampere.bundle.content-editor.ContentEditorBundle");
