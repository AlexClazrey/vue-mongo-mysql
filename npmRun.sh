#!/bin/bash
POS="$(cd "$(dirname "$0")"; pwd -P;)"
echo "--- Clearing old log file ---"
cd "$POS"
cp /dev/null express.log
cp /dev/null vue.log
echo "--- Starting express-server and vue-server with output to run.log ---"
cd "$POS"/express-server
npm start &>> ../express.log &
cd "$POS"/vue-server
npm run serve &>> ../vue.log &
cd "$POS"
echo "--- Start watching run.log ---"
tail -f express.log vue.log

