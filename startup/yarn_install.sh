#!/bin/bash
POS="$( cd "$(dirname "$0")" ; pwd -P )/.."

echo "----- Package Install Start --------"
yarn --cwd "$POS"/express-server
yarn --cwd "$POS"/vue-server
echo "----- Package Install Finished -----"
echo

echo "[INFO] MongoDB and MySQL connection config is in /express-server/config.json ."
echo "[INFO] If you want to accept public traffic, you need change public ip address in /vue-server/config.json .";
echo "[INFO] Use 'npm start' in express-server and 'npm run serve' in vue-server to start."
echo "[INFO] npmRun*.sh packed two commands above."
echo "[INFO] choose npmRun_cygwin.sh on Windows, or npmRun_linux.sh on Linux."

