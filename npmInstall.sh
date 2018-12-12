#!/bin/bash
Folder = `dirname $0`;
cd $Folder/express-server;
npm install;
cd $Folder/vue-server;
npm install;
cd $Folder;
echo "[INFO] MongoDB and MySQL connection config is in express-server/config.json.";
echo "[INFO] If you want to accept public traffic, don't forget to change your public ip address in vue-server/vue.config.js and vue-server/config/config.js.";
echo "[INFO] Then use 'npm start' in express-server and 'npm run serve' in vue-server to serve.";
