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

## Using bundles in your application

You can reference bundles in this repo in your application's minifierAppSetup with `oskari-frontend-contrib`:
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
As long as the repositories are side by side, the build process will be able to resolve the reference to `oskari-frontend-contrib`.

## Building applications

This repository also houses some application configurations (under `applications/`). After you have done the basic setup (above), applications can be built directly from this repo with eg. `npm run build -- --env.appdef=1.48:applications/paikkatietoikkuna.fi`. The output will be under `dist/`. See the main [oskari-frontend repo](https://github.com/oskariorg/oskari-frontend#readme) for detailed instructions about the build parameters.


## Contributing

If you would like to contribute your own bundles to this repo, please make a Pull request. Each bundle should have a README stating:
1. Which versions of Oskari the bundle is compatible with
2. Who is the maintainer of the bundle (contact information)

 
