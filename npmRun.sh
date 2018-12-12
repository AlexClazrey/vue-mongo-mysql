#!/bin/bash
POS="$(cd "$(dirname "$0")"; pwd -P;)"
echo "--- Clearing old log file ---"
cd $POS
cp /dev/null run.log
echo "--- Starting express-server and vue-server with output to run.log ---"
cd $POS/express-server
npm start >> ../run.log &
cd $POS/vue-server
npm run serve >> ../run.log &
cd $POS
echo "--- Start watching run.log ---"
tail -f run.log

