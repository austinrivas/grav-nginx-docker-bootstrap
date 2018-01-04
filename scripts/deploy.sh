#!/usr/bin/env bash

source ./scripts/git_deploy.sh
source ./scripts/merge_env_pages.sh

merge_env_pages $1

if git diff-index --quiet HEAD --; then
    git_deploy $1
else
    echo "The ./grav/user/pages directory on $1 has changes that have not been committed to this deployment."

    read -p "Would you like to overwrite the changes made on $1? [Y/n]" -n 1 -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]
        echo "\nAborting deploy to $1."
        [[ "$0" = "$BASH_SOURCE" ]] && exit 1 || return 1 # handle exits from shell or function but don't exit interactive shell
    then
        echo "\nProceeding with deploy to $1."
        git_deploy $1
    fi
fi