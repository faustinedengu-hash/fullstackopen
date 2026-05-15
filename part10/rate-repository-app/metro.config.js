const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 2026 Standard: Enable modern package resolution
config.resolver.unstable_enablePackageExports = true;

module.exports = config;