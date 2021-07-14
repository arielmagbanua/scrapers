#!/usr/bin/env bash

npm run lint

# build the project and copied the contents in the root and then remove the dist.
npm run build && cp -r ./dist/* . && rm -rf ./dist

# publish the package.
npm publish

# restore git to previous state.
git clean -fd
