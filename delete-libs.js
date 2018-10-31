var path = require('path');
var fs = require('fs');
var glob = require('glob');
const fse = require('fs-extra');

var bundleFilePaths = glob.sync('/packages/**/bundle.js', {root: path.join(__dirname)});

const libPath = path.join(__dirname, '/libraries/');

bundleFilePaths.forEach(bundlePath => {
    let fileContent = fs.readFileSync(bundlePath, 'utf8');
    let modifed = false;
    const Oskari = {
        clazz: {
            define: (id, constructor, methods, metadata) => {
                if (!metadata.source) {
                    return;
                }
    
                if (metadata.source.scripts) {
                    metadata.source.scripts
                    .map(script => path.join(path.dirname(bundlePath), script.src))
                    .filter(path => {
                        return path.indexOf('oskari-frontend-contrib/libraries/') >= 0
                    })
                    .forEach(p => {
    
                        
                        if (fs.existsSync(p)) {
                            fse.moveSync(p, path.join(__dirname, 'saved' , p.substring(libPath.length)));
                        }
                        
                    });
                }
            }
        },
        bundle_manager: {
            installBundleClass: function (id, path) { }
        }
    }
    
    eval(fileContent);
});


