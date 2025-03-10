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

If you're experiencing issues with GitHub Pages trying to build with Jekyll, make sure:
1. The `.nojekyll` file exists in your build output
2. You've configured GitHub Pages to deploy from the correct branch/directory
3. Your GitHub Pages settings are set to "Deploy from a branch" with the branch set to "gh-pages"

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