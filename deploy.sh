#!/bin/bash

# Build the project
npm run build

# Create .nojekyll file to prevent Jekyll processing
touch dist/.nojekyll

# Deploy to GitHub Pages
npx gh-pages -d dist

echo "Deployed to GitHub Pages!" 