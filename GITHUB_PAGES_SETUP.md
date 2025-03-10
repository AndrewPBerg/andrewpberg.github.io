# GitHub Pages Setup Guide

To ensure your React application works correctly on GitHub Pages, follow these steps:

## 1. Configure GitHub Pages Settings

1. Go to your GitHub repository
2. Click on "Settings"
3. Scroll down to the "Pages" section in the sidebar
4. Under "Build and deployment":
   - Source: Select "GitHub Actions" (NOT "Deploy from a branch")
   - This will use our custom workflow instead of the default Jekyll workflow

## 2. Verify Custom Domain (if applicable)

If you're using a custom domain:
1. In the "Custom domain" section, enter your domain
2. Check "Enforce HTTPS" if desired
3. Click "Save"

## 3. Prevent Jekyll Processing

GitHub Pages by default tries to process sites with Jekyll, which breaks React applications. To prevent this:

1. Make sure a `.nojekyll` file exists in your repository's `public` folder
2. Our GitHub Actions workflow adds this file to the build output automatically
3. If you're still seeing Jekyll processing in the build logs:
   - Go to the "Actions" tab in your repository
   - Select the "Disable Jekyll" workflow
   - Click "Run workflow" to manually run it
   - This will create a `.nojekyll` file directly in the deployed site

## 4. Troubleshooting

If your site isn't working correctly:

1. Check the GitHub Actions workflow runs:
   - Look for any errors in the "Deploy to GitHub Pages" workflow
   - Verify that the workflow completed successfully

2. Check for Jekyll processing:
   - If you see `actions/jekyll-build-pages@v1` in your build logs, GitHub is still trying to use Jekyll
   - Follow the steps in section 3 to disable Jekyll

3. Verify configuration:
   - Check that your `vite.config.ts` has the correct `base` path
   - Ensure your React Router is configured with the correct `basename`

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