# Andrew Berg's GitHub Pages Site

This repository contains the source code for my personal website hosted at [andrewpberg.github.io](https://andrewpberg.github.io).

## Development

To run the development server:

```bash
npm install
npm run dev
```

The site will be available at http://localhost:8080.

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the main branch using GitHub Actions.

To manually deploy:

```bash
npm run deploy
```

Or use the provided shell script:

```bash
chmod +x deploy.sh
./deploy.sh
```

### Important Note About GitHub Pages and Jekyll

This repository includes a `.nojekyll` file in both the `public` directory and the build output to prevent GitHub Pages from processing the site with Jekyll. This is necessary for React applications to work correctly on GitHub Pages.

#### Fixing Jekyll Processing Issues

If GitHub Pages is still trying to use Jekyll to build your site (as indicated by `actions/jekyll-build-pages@v1` in the build logs), follow these steps:

1. **Ensure GitHub Pages is configured to use GitHub Actions**:
   - Go to your repository on GitHub
   - Navigate to Settings > Pages
   - Under "Build and deployment", select "GitHub Actions" as the source
   - This will use our custom workflow instead of the default Jekyll workflow

2. **Verify the `.nojekyll` file exists**:
   - The file should be present in both the `public` directory and the deployed site
   - Our GitHub Actions workflow adds this file automatically

3. **If issues persist**:
   - Run the "Disable Jekyll" workflow manually from the Actions tab
   - This will create a `.nojekyll` file directly in the deployed branch

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- GSAP for animations

## Project Structure

- `/src` - React components and application code
- `/public` - Static assets
- `/styles` - Global CSS styles
- `/dist` - Build output (not committed to repository) 