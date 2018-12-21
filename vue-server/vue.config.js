const fs = require('fs');
const path = require('path');

const conf = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));


module.exports = {
	devServer: {
		host: '0.0.0.0',
		hot: true,
		disableHostCheck: true,
		public: conf.webServer.host,
	},
	configureWebpack: {
		devtool: 'source-map'
	}
}