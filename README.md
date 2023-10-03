# Oskari frontend contrib

These are unofficial bundles for Oskari created by the Oskari community. Many of them add value to your Oskari install, but they come with no official support from the core Oskari team.

## Using contrib bundles in your application

To use bundles from this repo in your application (see `sample-application` as a template for customized application repository):

1) Add dependency like `oskari-frontend` in your applications `package.json`:
```
    "oskari-frontend-contrib": "https://git@github.com/oskariorg/oskari-frontend-contrib.git#2.0.0"
``` 
Where `2.0.0` at the end is a tag in the repository. Tags are used to mark versions. Use the same version that you use for `oskari-frontend` for best compatibility.

2) Run `npm install` on your app

3) In your applications `main.js` import the bundles the same way you would import bundles from `oskari-frontend` but just with a different path:

```javascript
import 'oskari-loader!oskari-frontend-contrib/packages/analysis/ol/analyse/bundle.js';
import 'oskari-loader!oskari-frontend-contrib/packages/mapping/ol/mapanalysis/bundle.js';
```

## Developing bundles that are in contrib repository

If you want to develop the contrib bundles or contribute a new one you will need to set up the dependency in `dev-mode` like you would do with `oskari-frontend`.

### Setup for development environment

This repository, the main oskari-frontend repository and your applications repository should be located side by side on your filesystem. Here are the steps to setup the build environment:

1. Make sure you have the command line programs `git`, and `node` version 10 or greater
2. Clone the main frontend repository: `git clone https://github.com/oskariorg/oskari-frontend.git`
3. Clone the contrib repository (this one): `git clone https://github.com/oskariorg/oskari-frontend-contrib.git`
    - Now we have directories `oskari-frontend` and `oskari-frontend-contrib` side by side
4. Run `npm install` in `oskari-frontend` folder
5. Run `npm install ../oskari-frontend` in your applications folder (for example `sample-application`)
6. Run `npm install ../oskari-frontend-contrib` in your applications folder (for example `sample-application`)

In this model, it's left to the developer to checkout the correct branches/versions of the above repos.
With the symlinks in place import-statements and other path references to `oskari-frontend` will resolve to the appropriate directories. 

## Contributing

If you would like to contribute your own bundles to this repo, please make a Pull request. Each bundle should have a README stating:
1. Which versions of Oskari the bundle is compatible with
2. Who is the maintainer of the bundle (contact information)

### Libraries

Before adding a library dependency (either under `libraries/` or via NPM), you should check if the library is already included in `oskari-frontend` repo. If it is, you can reference it in your bundle.js with eg. `oskari-frontend/libraries/geostats/1.5.0/lib/geostats.min.js`. NPM package dependencies defined in `oskari-frontend` repo can be imported directly in code found in this repo eg. Open Layers `import olMap from 'ol/Map';`. Note: this is not how node module resolution usually works; it's a special feature of the Oskari build system aimed to avoid library code duplication & version conflicts. To see which packages can be used in this way, see `dependencies` in [oskari-frontend package.json](https://github.com/oskariorg/oskari-frontend/blob/master/package.json).

## License
 
This work is dual-licensed under MIT and [EUPL v1.1](https://joinup.ec.europa.eu/software/page/eupl/licence-eupl) 
(any language version applies, English version is included in https://github.com/oskariorg/oskari-docs/blob/master/documents/LICENSE-EUPL.pdf).
You can choose between one of them if you use this work.
 
`SPDX-License-Identifier: MIT OR EUPL-1.1`

Copyright (c) 2014-present National Land Survey of Finland
