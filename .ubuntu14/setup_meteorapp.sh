#!/bin/bash
clear
echo 'Moving to home dir...'
cd ~
echo 'unbundling meteor app ..'
tar -zxf gstrocks.tar.gz
echo 'Changing to server dir ..'
cd /home/gstrocks/bundle/programs/server
echo 'Doing npm install..'
npm install
echo 'Removing unwanted bcrypt dir..'
sudo rm -r /home/gstrocks/bundle/programs/server/npm/npm-bcrypt/node_modules/bcrypt
echo 'Restart meteor upstart service gstrocks...'
sudo service gstrocks restart