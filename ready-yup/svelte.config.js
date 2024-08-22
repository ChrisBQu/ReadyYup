import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',        // Path to output the static files
      assets: 'build',       // Path to output the assets
      fallback: 'index.html' // Serve index.html for all routes
    }),
    prerender: {
      entries: ['*']        // This will prerender all your routes
    }
  }
};
