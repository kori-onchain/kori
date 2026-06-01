const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver ?? {};

// Tell Metro to prefer the `browser` export condition so packages like `jose`
// resolve to their browser-safe builds instead of the Node.js ones.
config.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "default",
];

module.exports = withNativeWind(config, { input: "./global.css" });
