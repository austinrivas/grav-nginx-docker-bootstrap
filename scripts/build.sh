#!/bin/bash
# Ensure we get our whole bash environment
source $HOME/.bash_profile
# FILES_CHANGED is a comma seperated list of files that changed in this deployment
FILES_CHANGED=$1
# test | stage | prod
APP_ENV=$2
APP_ROOT=$(pwd)
GRAV_ROOT=$APP_ROOT/grav
THEME_NAME=haywire
THEME_ROOT=$GRAV_ROOT/user/themes/$THEME_NAME

function build_application() {
    log_header 'Start Building Application'
    create_backup
    install_dependencies
    clear_cache
    build_front_end
    log_header 'Finished Building Application'
}

function build_front_end() {
    log_header 'Start Building Front-End'
    cd $THEME_ROOT
    yarn install
    yarn run production
    log_header 'Finished Building Front-End'
}

function clear_cache() {
    log_header 'Start Clearing Cache'
    cd $GRAV_ROOT
    bin/grav clear-cache --all
    log_header 'Finished Clearing Cache'
}

function create_backup() {
    log_header 'Start Creating Backup'
    cd $GRAV_ROOT/backup
    rm ./backup.zip.previous
    find . -name 'backup.zip.current' -exec bash -c 'mv "$1" "${1%/*}"/backup.zip.previous' -- {} \;
    cd $GRAV_ROOT
    bin/grav backup
    cd $GRAV_ROOT/backup
    find . -name '*.zip' -exec bash -c 'mv "$1" "${1%/*}"/backup.zip.current' -- {} \;
    log_header 'Finished Creating Backup'
}

function install_dependencies() {
    log_header 'Start Installing Dependencies'
    cd $GRAV_ROOT
    bin/grav install
    composer install
    log_header 'Finished Installing Dependencies'
}

function log_configuration() {
    log_header 'Environment Name : '$APP_ENV
    log_header 'Node Version '$(node -v)
    log_header 'NPM Version '$(npm -v)
    log_header "$(composer --version --no-ansi)"
}

function log_header() {
    LINE_BREAK='#===================================================='
    HEADER=$1
    printf '%s\n# %s\n%s\n' $LINE_BREAK "$HEADER" $LINE_BREAK
}

function log_changed_files() {
    log_header 'Changed Files'
    printf "%s\n" $FILES_CHANGED
    log_header 'END of Changed Files'
}

# Check to see if our nginx vhost files have changed
# If so then we need to restart our Nginx service
function restart_nginx() {
    ENV_VHOST="nginx/sites-available/vhost-$APP_ENV.conf"
    if [[ $FILES_CHANGED == *"$ENV_VHOST"* ]]; then
      log_header 'Restarting NGINX'
      sudo /bin/systemctl restart nginxcomp
      log_header 'NGINX Restarted'
    fi
}

log_configuration
log_changed_files
build_application
restart_nginx