# Moving bundles between the core and contrib repositories

While just moving the folders would work it's a good idea to preserve the history when we can. These instructions can be used to do just that.

1.  Clone a new copy of the oskari-frontend repository

*It’s important to create a fresh clone* of the repository as what we are about to do to it will make it *unusable*.

    git clone https://github.com/oskariorg/oskari-frontend.git tmp-core
    cd tmp-core

2. Extract a bundle and it’s history

This is a *destructive operation*! Make sure you are using the temporary clone from step one. In this step we’ll checkout the branch from which we want to move the project and then we’ll rewrite the branch so that it only contains commits to the project we want to move.

In this example we are moving the sample/tetris bundle from core to contrib repository

    git checkout develop
    git filter-branch --prune-empty --subdirectory-filter bundles/sample/tetris develop

The git filter-branch command will move the files from bundles/sample/tetris to the root and everything else in the repository have been removed.

3. Move the files to correct path in the new repository

Next we need to move the files to the path they are going to be in the oskari-frontend-contrib repository which is under sample/tetris.

    mkdir -p sample/tetris
    git mv -k * sample/tetris
    git commit -m "Moved sample/tetris from core to contrib repo"

Now the files are in their right place and the changes have been committed to the repository.

4. Pull the bundle from tmp-core repository to oskari-frontend-contrib repository

Now you need to clone the oskari-frontend-contrib repository if you haven’t done it yet. I’m assuming that it is next to the tmp-core.

    cd oskari-frontend-contrib
    git remote add tmp-core ../tmp-core
    git checkout -b sample-tetris-move
    git pull tmp-core develop --allow-unrelated-histories

As of Git 2.9 you might need to use the --allow-unrelated-histories flag to merge. Now you are ready to merge it to develop or send a pull request for merging it. Note that the branch needs to be merged and cannot be rebased.

5. Clean up 

- Remove the relocated bundle from oskari-frontend repository

    cd oskari-frontend
    git rm -r bundles/sample/tetris
    # packages?
    git commit -m 'Moved sample/tetris to contrib repository'

- Remove the tmp-core folder
- Remove the tmp-core remote from oskari-frontend-contrib

    git remote rm tmp-core

