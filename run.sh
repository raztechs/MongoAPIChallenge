#!/bin/bash

if [ $# -eq 0 ]
	then
		docker-compose up
	else
		if [ $1 == "setup" ]
			then
				echo "Build server container"
				docker-compose build &> /dev/null
				echo "Initialize mongo"
				timeout 10 docker-compose up mongo &> /dev/null
		fi
		if [ $1 == "clean" ]
			then
				docker-compose rm -f
		fi
fi