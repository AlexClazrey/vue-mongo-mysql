#!/bin/bash
POS="$( cd "$(dirname "$0")" ; pwd -P )"
cd "$POS"/express-server
npm install
cd "$POS"/vue-server
npm install
cd "$POS"
echo "[INFO] MongoDB and MySQL connection config is in express-server/config.json."
echo "[INFO] If you want to accept public traffic, you need change public ip address in vue-server/config.js.";
echo "[INFO] Use 'npm start' in express-server and 'npm run serve' in vue-server to start."
echo "[INFO] npmRun.sh packed two commands above."
