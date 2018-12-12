#!/bin/bash
POS=pwd
cd $POS/express-server
npm start >> ../run.log &
cd $POS/vue-server
npm run serve >> ../run.log &
cd $POS
tail -f run.log

