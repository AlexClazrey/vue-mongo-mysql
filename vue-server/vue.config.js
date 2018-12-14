var conf = require('./config.js');

module.exports = {
	devServer: {
		host: '0.0.0.0',
		hot: true,
		disableHostCheck: true,
		public: conf.webServer.address,
	}
}