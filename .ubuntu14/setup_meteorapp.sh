#!/bin/bash
clear
echo 'Moving to home dir...'
cd ~
echo 'unbundling meteor app ..'
sudo tar -zxf gstrocks.tar.gz
echo 'Removing unwanted bcrypt dir..'
sudo rm -r /home/gstrocks/bundle/programs/server/npm/npm-bcrypt/node_modules/bcrypt
echo 'Changing to server folder...'
cd /home/gstrocks/bundle/programs/server
echo 'Doing npm install bcrypt..'
sudo npm install bcrypt
echo 'Copying bcrypt folder from server/n_m to server/npm/npm-bcrypt/n_m ..'
sudo cp -r /home/gstrocks/bundle/programs/server/node_modules/bcrypt /home/gstrocks/bundle/programs/server/npm/npm-bcrypt/node_modules/
echo 'Restarting meteor upstart service gstrocks...'
sudo service gstrocks restart
echo 'See gstrocks upstart problems log @ /var/log/upstart/gstrocks.log..'