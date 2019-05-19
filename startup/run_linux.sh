#!/bin/bash
POS="$(cd "$(dirname "$0")"; pwd -P;)/.."

echo "[Info] Clearing old log file."
cd "$POS"
cp /dev/null express.log
cp /dev/null vue.log

# run nginx
NGINXCMD='nginx -p '"$POS"' -c '"$POS"'/startup/nginx.conf'
SUDONGINXCMD='sudo '$NGINXCMD
NGINXPRO=`ps aux | grep 'nginx' | grep 'master process'`;
NGINXISOURS=`echo $NGINXPRO | grep "$NGINXCMD"`

if [ -z "$NGINXPRO" ]
then
	echo "[Info] Starting Nginx.";
	$SUDONGINXCMD
else
	echo "[Info] Nginx is running at"
	echo $NGINXPRO
	# restart nginx every time
	# if [ -z "$NGINXISOURS" ]; then
	if [ 1 ]; then
		echo "[Warning] Nginx running is not our nginx."
		echo "[Warning] Now I will stop it."
		sudo nginx -s quit &> /dev/null
		if [ $? -ne 0 ]; then
			echo "[Info] nginx quit signal sent failed, now I will kill it."
			sudo kill `echo $NGINXPRO | cut -d ' ' -f 2`
		fi
		echo "[Info] Starting our new nginx."
		$SUDONGINXCMD
	else
		echo "[Info] Nginx is working."
		echo "[Info] So not start nginx again."
	fi
fi

# run server
# choose yarn or npm to run server, yarn is perferred.
YARN=`command -v yarn`
NPM=`command -v npm`
CMD=`[ -z "$YARN" ] && echo $NPM || echo $YARN`

echo "[Info] Starting express-server and vue-server with output to *.log."
cd "$POS"/express-server
$CMD start &>> ../express.log &
disown
cd "$POS"/vue-server
$CMD run serve &>> ../vue.log &
disown
cd "$POS"

