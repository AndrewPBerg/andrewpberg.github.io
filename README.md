# Andrew Berg's GitHub Pages Site

This repository contains the source code for my personal website hosted at [andrewpberg.github.io](https://andrewpberg.github.io).

Feel free to clone this code for your own use case. Just make sure to credit me on the site thanks 🤝

## Info
used the following stack:
- three.js
- GSAP
- vantra.js
- vite
- react
- node.js
- lucide UI

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
