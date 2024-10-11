module.exports = {
    configureWebpack: {
      resolve: {
        fallback: {
          process: require.resolve('process/browser'),
        },
      },
    },
  };
  