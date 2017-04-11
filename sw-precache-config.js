module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist',
  root: 'dist/',
  staticFileGlobs: [
    'dist/index.html',
    'dist/**.js',
    'dist/**.css',
    'dist/i18n/**.json',
    'dist/**.json'
  ],
  runtimeCaching: [{
    urlPattern: /^https:\/\/ch047.tk/,
    handler: 'networkFirst',
    options: {
      cache: {
        maxEntries: 10,
        name: 'runtime-cache'
      }
    }
  }]
};
