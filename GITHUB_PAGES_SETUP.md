# GitHub Pages Setup Guide

To ensure your React application works correctly on GitHub Pages, follow these steps:

## 1. Configure GitHub Pages Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Scroll down to the "Pages" section in the sidebar
4. Under "Build and deployment":
   - Source: Select "Deploy from a branch"
   - Branch: Select "gh-pages" and "/ (root)"
   - Click "Save"

## 2. Verify Custom Domain (if applicable)

If you're using a custom domain:
1. In the "Custom domain" section, enter your domain
2. Check "Enforce HTTPS" if desired
3. Click "Save"

## 3. Check for Jekyll Processing

GitHub Pages by default tries to process sites with Jekyll, which can break React applications. To prevent this:

1. Make sure a `.nojekyll` file exists in your repository's `public` folder
2. Ensure your build process copies this file to the output directory
3. Alternatively, manually add a `.nojekyll` file to the `gh-pages` branch

## 4. Troubleshooting

If your site isn't working correctly:

1. Check the GitHub Actions workflow runs (if using GitHub Actions)
2. Verify the `.nojekyll` file exists in the deployed branch
3. Check that your `vite.config.ts` has the correct `base` path
4. Ensure your React Router is configured with the correct `basename`

## 5. Manual Deployment

If GitHub Actions isn't working, you can manually deploy:

```bash
npm run deploy
```

Or use the provided script:

```bash
chmod +x deploy.sh
./deploy.sh
``` 