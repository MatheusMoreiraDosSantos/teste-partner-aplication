new ModuleFederationPlugin({
  name: "partnerApplication",
  filename: "remoteEntry.js",
  exposes: {
    "./App": "./src/App",
  },
});
