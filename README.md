# Oskari frontend contrib

These are unofficial bundles for Oskari created by the Oskari community. Many of them add value to your Oskari install, but they come with no official support from the core Oskari team.

## Setup

The application build process assumes that this repository and the main oskari-frontend repository are located side by side on your filesystem. Here are the steps to setup the build environment:

1. Make sure you have the command line programs `git`, and `node` version 8 or greater
2. Clone the main frontend repository: `git clone https://github.com/oskariorg/oskari-frontend.git`
3. Clone the contrib repository (this one): `git clone https://github.com/oskariorg/oskari-frontend-contrib.git`
    - Now we have directories `oskari-frontend` and `oskari-frontend-contrib` side by side
4. Change directory `cd oskari-frontend` and run `npm install` to install dependencies from npm
5. Change directory `cd ..`, `cd oskari-frontend-contrib` and run `npm install` to install dependencies from npm
    - This step will link `oskari-frontend` under `node_modules` in `oskari-frontend-contrib`

In this model, it's left to the developer to checkout the correct branches/versions of the above repos.

## Using bundles in your application

To use bundles from this repo in your application, set up the application project directory side by side with the above repos. Add `"oskari-frontend-contrib": "file:../oskari-frontend-contrib"` under dependencies in your package.json and run `npm install`. If you don't use NPM and package.json for dependency management, you can just create a directory named `node_modules` inside your project directory, and within create a symbolic links to `oskari-frontend` (created in step 2 above) and `oskari-frontend-contrib` (created in step 3 above) directories.

After this setup, you can reference bundles in this repo in your application's minifierAppSetup with `oskari-frontend-contrib`:
```
{
    "bundlename": "analyse",
    "metadata": {
        "Import-Bundle": {
            "analyse": {
                "bundlePath": "oskari-frontend-contrib/packages/analysis/ol3/"
            }
    }
}
```

## Building applications

This repository also houses some application configurations (under `applications/`). After you have done the basic setup (above), applications can be built directly from this repo with eg. `npm run build -- --env.appdef=1.48:applications/asdi`. The output will be under `dist/`. See the main [oskari-frontend repo](https://github.com/oskariorg/oskari-frontend#readme) for detailed instructions about the build parameters.


## Contributing

If you would like to contribute your own bundles to this repo, please make a Pull request. Each bundle should have a README stating:
1. Which versions of Oskari the bundle is compatible with
2. Who is the maintainer of the bundle (contact information)

### Managing dependencies

With the symlinks in place import-statements and other path references to `oskari-frontend` will resolve to the appropriate directories. This means you can reference bundles in `oskari-frontend` repo with eg. `"bundlePath": "oskari-frontend/packages/statistics/"` in minifierAppSetup.json. The same principle works in bundle.js for defining bundle dependencies.

### Libraries

Before adding a library dependency (either under `libraries/` or via NPM), you should check if the library is already included in `oskari-frontend` repo. If it is, you can reference it in your bundle.js with eg. `oskari-frontend/libraries/geostats/1.5.0/lib/geostats.min.js`. NPM package dependencies defined in `oskari-frontend` repo can be imported directly in code found in this repo eg. Open Layers `import olMap from 'ol/Map';`. Note: this is not how node module resolution usually works; it's a special feature of the Oskari build system aimed to avoid library code duplication & version conflicts. To see which packages can be used in this way, see `dependencies` in [oskari-frontend package.json](https://github.com/oskariorg/oskari-frontend/blob/master/package.json).

If the library isn't included in `oskari-frontend` repo, you can add it into this repo, either as dependency in package.json (preferred) or under `libraries/`. Dependencies under `libraries/` require a reference in bundle.js, NPM dependencies do not; just `import` in your code.

 
