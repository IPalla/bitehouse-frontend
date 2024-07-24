// webpack.config.js
module.exports = {
    devServer: {
      headers: {
        'X-Frame-Options': 'ALLOWALL' // Adjust this according to your needs
      }
    }
  };
  