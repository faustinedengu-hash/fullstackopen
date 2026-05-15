module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // This is crucial for React 19 / Apollo 4 compatibility in 2026
      '@babel/plugin-transform-export-namespace-from',
    ],
  };
};