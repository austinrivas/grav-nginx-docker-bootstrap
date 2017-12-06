#!/bin/bash

# Assign passed in variables
# FILES_CHANGED is a comma seperated list of files that changed in this deployment
FILES_CHANGED=$1
APP_ENV=$2

# Migrate the database if there are any migrations
echo "------------ Changed the following files... ---------"
echo $FILES_CHANGED
echo "----------------------------------------------------"

# Ensure we get our whole bash environment
source $HOME/.bash_profile

echo "Starting the build process..."

echo "=================== NPM Version ===================="
npm -v

echo "=================== Node Version ==================="
node -v

echo "================= Composer Version ================="
composer --version

echo "=================== Dependencies ==================="
cd grav/
bin/grav install

echo "====================== Build ======================="
cd ../theme
yarn install
yarn && yarn run production

# Check to see if our nginx vhost files have changed
# If so then we need to restart our Nginx service
ENV_VHOST="nginx/sites-available/vhost-$APP_ENV.conf"
if [[ $FILES_CHANGED == *"$ENV_VHOST"* ]]; then
  echo "Virtual host file was changed for this environment. Bouncing web server..."
  sudo /bin/systemctl restart nginx
fi