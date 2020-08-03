module.exports = function(api) {
  api.cache(true);

  const presets = [];
  const plugins = [
    '@babel/plugin-proposal-optional-chaining',
    // '@simbathesailor/babel-plugin-use-what-changed',
    // [
    //   '@simbathesailor/babel-plugin-use-what-changed',
    //   {
    //     active: process.env.NODE_ENV === 'development' // boolean
    //   }
    // ]
  ];

  return {
    presets,
    plugins
  };
};
