#!/bin/bash 
    echo "" > /etc/nginx/sites-available/default 
    ok="0" 
    while IFS="" read line 
    do 
        if [ "$line" = "server {" ]; then 
            ok="1" 
        fi 
        if [ "$ok" = "1" ]; then 
            echo "$line" >> /etc/nginx/sites-available/default 
        fi 
        if [ "$line" = "}" ]; then 
            ok="0" 
        fi 
    done < /usr/share/nginx/html/webserver-configs/nginx.conf
